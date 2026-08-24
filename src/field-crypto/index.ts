import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

export function keyFromSecret(secret = "case-study-local-key"): Buffer {
  return createHash("sha256").update(secret).digest()
}

export function createFieldProtector(secret?: string) {
  const key = keyFromSecret(secret)

  return {
    encrypt(plaintext: string): string {
      const iv = randomBytes(12)
      const cipher = createCipheriv("aes-256-gcm", key, iv)
      const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
      const tag = cipher.getAuthTag()
      return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".")
    },

    decrypt(ciphertext: string): string {
      const [iv, tag, encrypted] = ciphertext.split(".")
      if (!iv || !tag || !encrypted) throw new Error("invalid encrypted field")
      const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64url"))
      decipher.setAuthTag(Buffer.from(tag, "base64url"))
      return Buffer.concat([
        decipher.update(Buffer.from(encrypted, "base64url")),
        decipher.final(),
      ]).toString("utf8")
    },

    blindIndex(value: string): string {
      return createHmac("sha256", key).update(value.trim().toUpperCase()).digest("hex")
    },
  }
}

export function hashPasscode(passcode: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(passcode, salt, 64)
  return `${salt.toString("hex")}.${hash.toString("hex")}`
}

export function verifyPasscode(passcode: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(".")
  if (!saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, "hex")
  const actual = scryptSync(passcode, Buffer.from(saltHex, "hex"), expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export function maskCertificate(value: string): string {
  const text = value.trim()
  if (text.length <= 4) return "****"
  return `${text.slice(0, 4)} **** **** ${text.slice(-4)}`
}

export function maskPhone(value?: string | null): string {
  if (!value) return "未填写"
  const text = value.trim()
  return text.length >= 7 ? `${text.slice(0, 3)}****${text.slice(-4)}` : "已填写"
}

