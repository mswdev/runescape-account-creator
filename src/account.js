const request = require('request-promise');
const two_captcha_client = require('@infosimples/node_two_captcha');
const supplier = require('./supplier');
const constants = require('./constants');

const google_recaptcha_api_key = '6Lcsv3oUAAAAAGFhlKrkRb029OHio098bbeyi_Hv';
const runescape_create_account_url = 'https://secure.runescape.com/m=account-creation/create_account';

class Account {
    static async create(two_captcha_api_key, email, password, socks_ip, socks_port, socks_username, socks_password) {
        try {
            let proxy_url = supplier._formatProxy(socks_ip, socks_port, socks_username, socks_password);
            let get_email = supplier._getEmail(email);
            let get_password = supplier._getPassword(password);

            let recaptcha_post = await this._sendRecaptchaPost(two_captcha_api_key, proxy_url);
            let account_post = await this._sendAccountPost(recaptcha_post.text, get_email, get_password, socks_ip, socks_port, socks_username, socks_password);

            return this._formatResponse(account_post, get_email, get_password, proxy_url)
        } catch (error) {
            return error;
        }
    }

    static _getClient(two_captcha_api_key) {
        return new two_captcha_client(two_captcha_api_key, {
            timeout: 80000,
            polling: 5000,
            throwErrors: true
        });
    }

    static _sendAccountPost(google_recaptcha_key, email, password, socks_ip, socks_port, socks_username, socks_password) {
        return request({
            method: 'POST',
            url: runescape_create_account_url,
            followAllRedirects: true,
            agentClass: supplier._getSocksAgent(socks_ip, socks_port),
            agentOptions: {
                socksHost: socks_ip,
                socksPort: socks_port,
                socksUsername: socks_username,
                socksPassword: socks_password
            },
            form: {
                email1: supplier._getEmail(email),
                onlyOneEmail: '1',
                password1: supplier._getPassword(password),
                onlyOnePassword: '1',
                day: supplier._getRandomDay(),
                month: supplier._getRandomMonth(),
                year: supplier._getRandomYear(),
                'create-submit': 'create',
                'g-recaptcha-response': google_recaptcha_key
            }
        })
    }

    static _sendRecaptchaPost(two_captcha_api_key, proxy_url) {
        return this._getClient(two_captcha_api_key).decodeRecaptchaV2({
            googlekey: google_recaptcha_api_key,
            pageurl: runescape_create_account_url,
            proxy: proxy_url,
            proxytype: 'SOCKS5'
        })
    }

    static _validateResponse(body, responses) {
        return responses.some(response => body.toLowerCase().includes(response.toLowerCase()));
    }

    static _formatResponse(body, email, password, proxy_url) {
        let account_details =
            {
                'email': email,
                'password': password,
                'proxy': proxy_url
            };
        if (this._validateResponse(body.toString(), constants.success)) {
            account_details['response'] = 'ACCOUNT_CREATED';
            return JSON.stringify(account_details, null, "\t");
        } else if (this._validateResponse(body.toString(), constants.invalid.valueOf())) {
            account_details['response'] = 'INVALID_CREDENTIALS';
            return JSON.stringify(account_details, null, "\t");
        }

        account_details['response'] = 'BAD_CAPTCHA';
        return JSON.stringify(account_details, null, "\t");
    }
}

module.exports = Account;