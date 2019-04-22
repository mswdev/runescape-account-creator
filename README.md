# Runescape Account Creator

![](https://discordapp.com/api/guilds/173837867976622082/widget.png?style=shield) [![npm](https://img.shields.io/npm/v/runescape-account-creator.svg?style=flat-square)](https://www.npmjs.com/package/runescape-account-creator) ![GitHub](https://img.shields.io/github/license/sphiinx/runescape-account-creator.svg?style=flat-square) 

## What is Runescape Account Creator?
Runescape Account Creator is an implementation in JavaScript for Node.js that provides the ability to create accounts for the video game [RuneScape®](https://runescape.com/).

## Installation
Install via [npm](https://www.npmjs.com/package/runescape-account-creator):
```
npm install runescape-account-creator
```

## Usage

The request is [Promise](https://evie.gitbook.io/js/promises) based therfore we
call `.then()` in order to access the response once it has been recieved.

First we will build a new [`AccountCreator`](src/runescape/AccountCreator.js) instance with our 2Captcha API key

```js
// Import the factory function for the AccountCreator
const { buildAccountCreator } = require('runescape-account-creator')
// Update the API key used to match your 2captcha.com API key
const twoCaptchaApiKey = 'YOUR_TWO_CAPTCHA_API_KEY'

const accountCreator = buildAccountCreator(twoCaptchaApiKey)

// Now we can start registering accounts!
accountCreator.register().then(response => {
    // destructure the response
    const { credentials, birthday } = response
    console.log('We made a new account with these credentials:', credentials)
    console.log('The birthday of the account is', birthday)
    console.log('The User-Agent header we sent was:', response.meta.userAgent)
}).catch(error => {
    console.error(error)
})
```

### Async/Await

Since we are using Promises, we can make use of
[async/await](https://javascript.info/async-await) if your JavaScript runtime
allows for it, or you are using a transpiler that supports code generation
for async/await.

```js
// Fat-arrow function
const registerAccount = async creator => await creator.register()

// traditional async function
async function singleRegistration (accountCreator) {
    return await accountCreator.register()
}

async function serialBatchRegistration (accountCreator) {
    const accounts = []
    for (let i = 1; i <= 10; i++) {
        console.log('Registering account', i)
        // this is where the syntax magic happens
        const { credentials, birthday } = await accountCreator.register()
        console.log(`Account was registered! ${credentials.email}:${credentials.password} with birthday ${birthday}`)
        accounts.push(account)
    }
    return accounts
}
```

See [examples.js](examples/examples.js) for more examples.

### Config

It is possible to configure the registration/captcha configuration in a couple different ways.

This package automatically tries to use a `.env` file via the
[dotenv](https://www.npmjs.com/package/dotenv) package. You can copy the
default configuration file by running:

```bash
cp node_modules/runescape-account-creator/.env.example .env
```

Or you can copy the contents of [.env.example](.env.example) here

### AccountCreator.register

Take a look at the [AccountCreator.register(options) documentation](https://account-creator.runetek.io/accountcreator#register)

|Parameter|Type|Required|Notes|
|---|---|---|---|
|email|String|No|The email to use when creating the account. If none is provided, one will be generated.|
|password|String|No|The password to use when creating the account. If none is provided, one will be generated.|
|birthday|Date|No|The birthday to use when creating the account. If none is provided, one will be generated.|

## Contributing

1. Clone this repository
    - `$ git clone https://github.com/Sphiinx/runescape-account-creator`
2. Install the npm [dependencies](#Dependencies)
    - `$ cd runescape-account-creator`
    - `$ npm install`
3. Make sure to run [eslint](https://eslint.org/) or enable automatic linting in your editor
    - `$ npm run lint`

You can also generate the documentation by running the following command:

```bash
npm run docs
```

Which will run [jsdoc](https://github.com/jsdoc/jsdoc) and publish the generated assets to the `docs/` directory.

## Dependencies
- [request-promise](https://www.npmjs.com/package/request-promise)
- [@infosimples/node_two_captcha](https://www.npmjs.com/package/@infosimples/node_two_captcha)
- [SOCKS5 HTTPS Client](https://www.npmjs.com/package/socks5-https-client)
- [faker](https://www.npmjs.com/package/faker)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [debug](https://www.npmjs.com/package/debug)
