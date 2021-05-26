const { Joi } = require('dvf-utils')

const get = require('../lib/dvf/get-authenticated')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  pool: Joi.string(),
  token: Joi.string(),
  amount: Joi.amount()
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'ammGetFundingOrders.js'
})

const endpoint = '/v1/trading/amm/fundingOrderData'

module.exports = async (dvf, data, nonce, signature) => get(
  dvf, endpoint, nonce, signature, validateData(data)
)
