const getExpirationTimestampInHours = require('./getExpirationTimestampInHours')
const generateRandomNonceV2 = require('./generateRandomNonceV2')

module.exports = ({ defaultStarkExpiry }) => transaction => {
  const expirationTimestamp = transaction.expirationTimestamp ||
    getExpirationTimestampInHours(defaultStarkExpiry)

  const nonce = transaction.nonce || generateRandomNonceV2()

  return {
    ...transaction,
    nonce,
    expirationTimestamp
  }
}
