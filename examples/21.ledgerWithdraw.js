#!/usr/bin/env node

const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')(
  process.env.CONFIG_FILE_NAME
)

const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)
provider.engine.stop()

const dvfConfig = {
  api: envVars.API_URL
  // Add more variables to override default values
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  const path = `44'/60'/0'/0'/0`
  const token = 'ETH'
  const amount = 0.10

  const starkWithdrawalData = await dvf.stark.ledger.createWithdrawalData(
    path,
    token,
    amount
  )

  const withdrawResponse = await dvf.ledger.withdraw(
    token,
    amount,
    starkWithdrawalData
  )

  console.log('withdraw response ->', withdrawResponse)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

