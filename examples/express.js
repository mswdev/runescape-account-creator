require('dotenv').config()

// $ npm i express
const express = require('express')

const { configFromEnv, createAccount } = require('./index')

const app = express()

const factoryConfig = configFromEnv()

app.post('/create-account', async (req, resp) => {
  try {
    const acc = await createAccount(factoryConfig)
    resp.send(acc)
  } catch (e) {
    resp.send({ error: e.message }).status(500)
  }
})

app.listen(8085)
