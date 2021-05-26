const P = require('aigle')

const createSignedTransaction = require('../createSignedTransaction')

module.exports = dvf => async data => {
  return {
    ...data,
    // Need to do this in series since createSignedTransaction might call
    // into ledger and these calls cannot be executed in parallel.
    starkOrders: P.mapSeries(
      data.starkOrders,
      createSignedTransaction(dvf)
    )
  }
}
