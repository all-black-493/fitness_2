import { randomBytes } from "crypto"

export interface KeyPair {
  publicKey: string
  privateKey: string
}

/**
 * Generates a new public/private key pair for E2E encryption
 * In a real implementation, this would use proper cryptographic libraries like libsodium
 * For now, we'll generate dummy keys for demonstration
 */
export function generateKeyPair(): KeyPair {
  // In production, use proper key generation like:
  // const keyPair = nacl.box.keyPair()
  // return {
  //   publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
  //   privateKey: Buffer.from(keyPair.secretKey).toString('base64')
  // }

  const publicKey = `pk_${randomBytes(16).toString("hex")}`
  const privateKey = `sk_${randomBytes(32).toString("hex")}`

  return { publicKey, privateKey }
}

/**
 * Stores the private key securely in browser storage
 * In production, use secure storage like IndexedDB with encryption
 */
export function storePrivateKey(privateKey: string, userId: string): void {
  if (typeof window !== "undefined") {
    // In production, encrypt before storing
    localStorage.setItem(`private_key_${userId}`, privateKey)
  }
}

/**
 * Retrieves the private key from secure storage
 */
export function getPrivateKey(userId: string): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(`private_key_${userId}`)
  }
  return null
}
