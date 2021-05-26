const { Joi } = require('dvf-utils')
const R = require('ramda')

const post = require('../lib/dvf/post-authenticated')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const nonNegativeInteger = Joi.number().integer().min(0)

const hasNoSignature = x => x.signature == null
const signIfNecessary = dvf => data => R.any(hasNoSignature, data.starkOrders)
  ? dvf.stark.singAmmFundingOrder(data)
  : data

// NOTE: this schema should be shared between backend and client.
const starkOrderSchema = Joi.object({
  vaultIdSell: nonNegativeInteger,
  vaultIdBuy: nonNegativeInteger,
  amountSell: Joi.string(),
  amountBuy: Joi.string(),
  tokenSell: Joi.string(),
  tokenBuy: Joi.string(),
  // If not provided, random nonce will be generated for each order.
  nonce: nonNegativeInteger.optional(),
  // If not provided, expirationTimestamp will be set based on
  // dvf.config.defaultStarkExpiry.
  expirationTimestamp: nonNegativeInteger.optional(),
  signature: Joi.object().optional().keys({
    v: Joi.string().optional(),
    r: Joi.string(),
    s: Joi.string()
  })
// If orders are pre-signed, nonce and expirationTimestamp needs to be present.
}).with('signature', ['nonce', 'expirationTimestamp'])

const schema = Joi.object({
  pool: Joi.string(),
  orders: Joi.array().items(starkOrderSchema)
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'ammFund'
})

const endpoint = '/v1/trading/amm/postAmmFundingOrder'

module.exports = async (dvf, data, nonce, signature) => post(
  dvf, endpoint, nonce, signature, R.compose(
    signIfNecessary,
    validateData
  )
)
