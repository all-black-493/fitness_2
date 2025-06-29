/**
 * Decrypts a message using the sender's public key and recipient's private key
 * In production, this would use proper decryption like NaCl.box.open
 */
export function decryptMessage(
  encryptedMessage: string,
  senderPublicKey: string,
  recipientPrivateKey: string,
): string | null {
  try {
    // In production implementation:
    // const messageWithNonce = Buffer.from(encryptedMessage, 'base64')
    // const nonce = messageWithNonce.slice(0, nacl.box.nonceLength)
    // const message = messageWithNonce.slice(nacl.box.nonceLength)
    // const decrypted = nacl.box.open(
    //   message,
    //   nonce,
    //   Buffer.from(senderPublicKey, 'base64'),
    //   Buffer.from(recipientPrivateKey, 'base64')
    // )
    // return decrypted ? Buffer.from(decrypted).toString('utf8') : null

    // For demonstration, decode our mock encrypted message
    const decoded = JSON.parse(Buffer.from(encryptedMessage, "base64").toString())
    const plaintext = Buffer.from(decoded.encrypted, "base64").toString()

    return plaintext
  } catch (error) {
    console.error("Failed to decrypt message:", error)
    return null
  }
}

/**
 * Decrypts a community message
 */
export function decryptCommunityMessage(
  encryptedMessage: string,
  communityId: string,
  userPrivateKey: string,
): string | null {
  try {
    const decoded = JSON.parse(Buffer.from(encryptedMessage, "base64").toString())

    // Verify this message belongs to the correct community
    if (decoded.community_id !== communityId) {
      return null
    }

    const plaintext = Buffer.from(decoded.encrypted, "base64").toString()
    return plaintext
  } catch (error) {
    console.error("Failed to decrypt community message:", error)
    return null
  }
}
