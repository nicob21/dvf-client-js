const path = `44'/60'/0'/0'/0`
const token = 'ETH'
const amount = 0.10

const withdrawResponse = await dvf.withdrawV2({token, amount})

logExampleResult(withdrawResponse)
