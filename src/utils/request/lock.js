class Lock {
   instance
  publicKey=
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCtZz85trc2HhDlUwlS6/DSPVi9qIYGLdvW+DJvrxvC2dTx3msPAcDcNQMzoTsY+KSfBGifu9UkKCV8MT9UXt8TRNZapW9fvH+7v9K52p8fRNmaK1ajA+shTI9c25eXToTDsEpDRMpvsQTsgGOjD0JPItRAGVYS5MIWkW55x1jlMwIDAQAB'
  privateKey =
    'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMYNe6IZLnQlNlynEYBmSeY+Na+Pa713eTYEIZevykvtnBQcrd/27XjPesusLw8HpisJA/fw9deCWsj5DTrcVcypXkV/dKjMeACwf1t/0mWf/r5muXez1lQYA22ECPqsyjKbzI0d4VvQjeoqxzyNK16tjFhvBRYd6Ov2ru8uC6vpAgMBAAECgYBsj+95R3xjRhKqbxn03B0eDHO5LFDOprLWnSUc1Mt7G2A21hGpdt1tH64b/uI8xuCbLnHycy8PVvEUwRAzd5u/gRuLcq3MQ7XS8pTQzrGb+LP/7wSFfy97ApMbM3+gNbeojXYhOYXQbNpRpFdk/+FE44xkosKMD6ELffL1llP8AQJBANwL33uDd7aMqYato8cw2tnXEyjMeCGCc8XET7xdeDP1FTXBWNGpqEoMBND0gu1StqIsbP8JzgLWqUK5j7SG0mECQQDmaaeAz+CbOHR94YrF3lLNkP0r0nT0qV/dZBpIqWcDMeGWgtGsmTrujuecvp6qCOjFyShNAyD7XcaLQ9IrCNaJAkEAgrKSpPwrSMQ3lQThuFguRSFYAe2glNa1CQxXB9zEnqe9V1Zl+PI6QPDuk2YHtgpg6+ZTPxCFym3Rzw4EaweBQQJAEwt+neYQ0aOr9U+0McC7pWQrmPivVB2/38PLbGAcNKZl2BP+Er8joN5NBKa45KMR4m9LFnqAumY45//2GjqDyQJAJDCZVwUybIOC+VSvEwdfX+YIcevFE3ROiGrrHiZMXFBqvIs0hOoOzBIDy5wDIhDBSqKI7r0xJ+UH2Y+5Pj9OWw=='

    static  generateInstance(){
    if (!this.instance) {
      this.instance = new Lock()
    }
    return this.instance
  }
   generateRandomIV(){
    return crypto.getRandomValues(new Uint8Array(12))
  }
  // 生成aes
  async generateAESKey() {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM', // 可选: "AES-CBC", "AES-CTR"
        length: 256, // 128, 192, or 256 bits
      },
      true, // 是否可导出
      ['encrypt', 'decrypt'] // 允许的操作
    )
  }
  exportAesKey(key){
    return crypto.subtle.exportKey('raw', key)
  }
   arrayBufferToBase64(buffer){
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
  }
  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
   async encryptionIV(iv) {
    const publicKeyBuffer = this.base64ToArrayBuffer(this.publicKey)
    const publicKey = await crypto.subtle.importKey(
      'spki', // <-- 确保格式是 "spki"
      publicKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    )
    return  crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, iv)
  }
   async decryptIV(iv) {
    const privateKeyBuffer = this.base64ToArrayBuffer(this.privateKey)
      const privateKey = await crypto.subtle.importKey(
        'pkcs8', 
        privateKeyBuffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['decrypt']
      )
      // 解密数据
      // const encryptedBuffer = base64ToArrayBuffer(encryptedBase64);
      return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, iv)
  }
  async encryptionRequestBody(data)  {
    let iv = this.generateRandomIV()
    const aesKey = await this.generateAESKey()
    const aesKeyBuffer = await this.exportAesKey(aesKey)
    const encodedData = new TextEncoder().encode(JSON.stringify(data))
    const originalData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      aesKey,
      encodedData
    )
    iv = await this.encryptionIV(iv)
    return {
      iv: this.arrayBufferToBase64(iv), 
      data: this.arrayBufferToBase64(originalData),
      key: this.arrayBufferToBase64(aesKeyBuffer),
    } 
  }

  async decryptResponseBody(body){
    try {
        let iv = this.base64ToArrayBuffer(body.iv)
        let aesKey = this.base64ToArrayBuffer(body.key)
        const originalData = this.base64ToArrayBuffer(body.data)
        iv = await this.decryptIV(iv)
        const key = await crypto.subtle.importKey('raw', aesKey, { name: 'AES-GCM' }, false, ['decrypt'])
        // 3️⃣ AES-GCM 解密
        const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, originalData)
        return JSON.parse(new TextDecoder().decode(decryptedBuffer))
      } catch (_) {
        return null
    }
  }
}

const lock = Lock.generateInstance()

export default lock
