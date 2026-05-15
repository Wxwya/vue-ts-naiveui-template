class Lock {
  static instance
  publicKey = ''   // 后端公钥，用于加密请求
  privateKey = ''  // 前端私钥，用于解密响应

  static generateInstance() {
    if (!this.instance) {
      this.instance = new Lock()
    }
    return this.instance
  }

  setKeys(backendPublicKey, frontendPrivateKey) {
    this.publicKey = backendPublicKey
    this.privateKey = frontendPrivateKey
  }

  generateRandomIV() {
    return crypto.getRandomValues(new Uint8Array(12))
  }

  async generateAESKey() {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  async importPublicKey() {
    if (!this.publicKey) {
      throw new Error('[LockAuth] 后端公钥未初始化，请先调用 lock.setKeys()')
    }
    return crypto.subtle.importKey(
      'spki',
      this.base64ToArrayBuffer(this.publicKey),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    )
  }

  async importPrivateKey() {
    if (!this.privateKey) {
      throw new Error('[LockAuth] 前端私钥未初始化，请先调用 lock.setKeys()')
    }
    return crypto.subtle.importKey(
      'pkcs8',
      this.base64ToArrayBuffer(this.privateKey),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['decrypt']
    )
  }

  async encryptionRequestBody(data) {
    const iv = this.generateRandomIV()
    const aesKey = await this.generateAESKey()
    const rawAesKey = await crypto.subtle.exportKey('raw', aesKey)

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      new TextEncoder().encode(JSON.stringify(data))
    )

    // IV 和 AES key 都用后端公钥加密
    const publicKey = await this.importPublicKey()
    const [encryptedIv, encryptedKey] = await Promise.all([
      crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, iv),
      crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, rawAesKey),
    ])

    return {
      iv: this.arrayBufferToBase64(encryptedIv),
      key: this.arrayBufferToBase64(encryptedKey),
      data: this.arrayBufferToBase64(encryptedData),
    }
  }

  async decryptResponseBody(body) {
    try {
      const privateKey = await this.importPrivateKey()

      // IV 和 AES key 都用前端私钥解密
      const [iv, rawAesKey] = await Promise.all([
        crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, this.base64ToArrayBuffer(body.iv)),
        crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, this.base64ToArrayBuffer(body.key)),
      ])

      const aesKey = await crypto.subtle.importKey(
        'raw',
        rawAesKey,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        this.base64ToArrayBuffer(body.data)
      )

      return JSON.parse(new TextDecoder().decode(decryptedBuffer))
    } catch {
      return null
    }
  }
}

const lock = Lock.generateInstance()
export default lock
