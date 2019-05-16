require('dotenv').config()

// $ npm i express
const express = require('express')

const { buildAccountCreator } = require('../index')

const app = express()

const accountCreator = buildAccountCreator('TWO_CAPTCHA_API_KEY')

app.post('/create-account', async (req, resp) => {
  try {
    const acc = await accountCreator.register({
      email: req.body.email,
      password: req.body.password
    })
    resp.send(acc)
  } catch (e) {
    resp.send({ error: e.message }).status(500)
  }
})

app.listen(8085)
