const account = require('../src/account');
const two_captcha_api_key = 'YOUR_TWO_CAPTCHA_API_KEY';

/**
 * Creates an account using the two captcha api key and generating a random email/password.
 * */
account.create(two_captcha_api_key).then(response => {
    console.log(response)
}).catch(error => {
    console.log(error)
});

/**
 * Creates an account using the two captcha api key and the specified email/password.
 * */
account.create(two_captcha_api_key, 'example@gmail.com', 'example_password').then(response => {
    console.log(response)
}).catch(error => {
    console.log(error)
});

/**
 * Creates an account using the two captcha api key, the specified email/password, and the specified socks5 proxy.
 * */
account.create(two_captcha_api_key, 'example@gmail.com', 'example_password', 'socks5_ip', 'socks5_port').then(response => {
    console.log(response)
}).catch(error => {
    console.log(error)
});

/**
 * Creates an account using the two captcha api key, generating a random email/password and the specified socks5 proxy.
 * */
account.create(two_captcha_api_key, null, null, 'socks5_ip', 'socks5_port').then(response => {
    console.log(response)
}).catch(error => {
    console.log(error)
});