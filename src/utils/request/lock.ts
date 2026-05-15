import type { EncryptionBody } from './request'

class Lock {
  private static instance?: Lock
  private publicKey: string = ''   // 后端公钥，用于加密请求
  private privateKey: string = ''  // 前端私钥，用于解密响应

  public static generateInstance(): Lock {
    if (!this.instance) {
      this.instance = new Lock()
    }
    return this.instance
  }

  setKeys(backendPublicKey: string, frontendPrivateKey: string) {
    this.publicKey = backendPublicKey
    this.privateKey = frontendPrivateKey
  }

  private generateRandomIV(): Uint8Array<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>
  }

  private async generateAESKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  private async importPublicKey(): Promise<CryptoKey> {
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

  private async importPrivateKey(): Promise<CryptoKey> {
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

  async encryptionRequestBody(data: Record<string, unknown>): Promise<EncryptionBody> {
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

  async decryptResponseBody<T>(body: EncryptionBody): Promise<DecryptBody<T> | null> {
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
