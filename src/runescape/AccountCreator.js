require('dotenv').config()
const debug = require('debug')('account-creator:main')

const url = require('url')
const faker = require('faker')

const { buildTwoCaptchaSolver } = require('../captcha/2CaptchaSolver')
const { RegisterAccountForm } = require('./forms')

function createConfig (apiKey = null) {
  return {
    runescape: {
      registerUrl: process.env.RUNESCAPE_CREATE_ACCOUNT_URL || 'https://secure.runescape.com/m=account-creation/create_account',
      siteKey: process.env.RUNESCAPE_RECAPTCHA_SITE_KEY || '6Lcsv3oUAAAAAGFhlKrkRb029OHio098bbeyi_Hv'
    },
    twoCaptcha: {
      apiKey: process.env.TWO_CAPTCHA_API_KEY || apiKey,
      options: {
        polling: process.env.TWO_CAPTCHA_POLLING || 5000,
        timeout: process.env.TWO_CAPTCHA_TIMEOUT || 80000,
        throwErrors: true
      }
    }
  }
}

/**
 * Creates an account based on the {@code accountFactoryParameters} object structure
 * @param {String} twoCaptchaApiKey
 */
function buildAccountCreator (twoCaptchaApiKey) {
  return new AccountCreator(createConfig(twoCaptchaApiKey))
}

/**
 * Used to create new RuneScape accounts.
 *
 * Config has 2captcha configuration as well as configuration for the RuneScape
 * registraion form's parameters
 *
 * @see {AccountCreator.register}
 */
class AccountCreator {
  constructor (config) {
    this.config = config
  }

  /**
   * Registers a new account.
   *
   * @param {Object} options Account credentials and registration options
   * @param {String} options.email Email to use for the account. defaults to generating an email with Faker
   * @param {String} options.password Password to use for the account. defaults to generating a password with Faker
   * @param {Date} options.birthday Birthday for the account. do not use a Date < 13 years before today. defaults to generating a date in the past with Faker
   * @param {String} options.proxy Optional. Proxy URI formatted string. ex: socks5://[username:password]@127.0.0.1:1234
   * @param {String} options.recaptchaToken If provided, we do not try to fetch the token from 2Captcha's API
   * @throws {ValidationError}
   */
  async register ({
    // string
    email,
    // string
    password,
    // Date
    birthday,
    proxy,
    userAgent,
    recaptchaToken
  }) {
    const form = new RegisterAccountForm(this.config.runescape.registerUrl)
    form.email = email || faker.internet.email()
    form.password = password || faker.internet.password(16, true)
    form.userAgent = userAgent || faker.internet.userAgent()

    form.birthday = birthday || faker.date.between('1985-01-01', '2001-12-31')

    debug('validation result', await form.validate())

    if (proxy) {
      form.proxy = new url.URL(proxy)
      debug('parsed proxy URL', form.proxy)
    }

    if (typeof recaptchaToken === 'string') {
      form.recaptchaToken = recaptchaToken
    } else {
      debug('No reCAPTCHA token passed. Fetching one from 2Captcha')
      form.recaptchaToken = await this.fetchRecaptchaToken(form.proxy)
    }

    const registeredAccount = await form.submit()

    debug('account creation successful!', registeredAccount)

    return registeredAccount
  }

  /**
   * Calls the 2Captcha API to get a reCAPTCHA token
   *
   * @returns Promise<String> Promise that resolves a token upon completion
   */
  async fetchRecaptchaToken (proxy = null) {
    const captcha = await buildTwoCaptchaSolver(this.config.twoCaptcha)
      .submit(
        this.config.runescape.registerUrl,
        this.config.runescape.siteKey,
        proxy
      )

    debug('Received 2captcha response', captcha)

    return captcha.text
  }
}

module.exports = {
  buildAccountCreator
}
