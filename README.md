# Runescape Account Creator

![](https://discordapp.com/api/guilds/173837867976622082/widget.png?style=shield) ![GitHub](https://img.shields.io/github/license/sphiinx/runescape-account-creator.svg?style=flat-square) ![Hackage-Deps](https://img.shields.io/hackage-deps/v/runescape-account-creator.svg?style=flat-square)

## What is Runescape Account Creator?
Runescape Account Creator is an implementation in JavaScript for Node.js that provides the ability to create accounts for the video game [Old School RuneScape®](https://oldschool.runescape.com/).

## Installation
Install via [npm](https://npmjs.com):
```
npm install runescape-account-creator
```

## Usage
The request is [promise](https://evie.gitbook.io/js/promises) based therfore we call `.then()` in order to access the response once it has been recieved.
```JavaScript
const account = require('runescape-account-creator');
const two_captcha_api_key = 'YOUR_TWO_CAPTCHA_API_KEY';

account.create(two_captcha_api_key).then(response => {
    console.log(response)
}).catch(function (error) {
    return error;
});
```

See [examples.js](https://github.com/Sphiinx/runescape-account-creator/blob/master/examples/examples.js) for more examples.

### Parameters
- `two_captcha_api_key` Your [2Captcha](https://2captcha.com/) API key.
  - Required: Yes
- `email` The email to use when creating the account. If none is provided, one will be generated.
  - Required: No
- `password` The password to use when creating the account. If none is provided, one will be generated.
  - Required: No
- `socks_ip` The socks5 proxy ip address to use when requesting the solved captcha and creating the account.
  - Required: No
- `socks_port` The socks5 proxy port to use when requesting the solved captcha and creating the account.
  - Required: No
- `socks_username` The socks5 proxy username to use when requesting the solved captcha and creating the account.
  - Required: No
- `socks_password` The socks5 proxy password to use when requesting the solved captcha and creating the account.
  - Required: No

## Dependencies
- [Request-Promise](https://github.com/request/request-promise)
- [Node TwoCaptcha](https://github.com/infosimples/node_two_captcha)
- [SOCKS5 HTTPS Client](https://github.com/mattcg/socks5-https-client)
- [Faker](https://github.com/Marak/Faker.js)
