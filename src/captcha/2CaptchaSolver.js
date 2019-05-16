const { formatProxyUrl } = require('../utils')
const debug = require('debug')('account-creator:captcha')
// eslint-disable-next-line no-unused-vars
const TwoCaptchaClient = require('@infosimples/node_two_captcha')

// eslint-disable-next-line no-unused-vars
const twoCaptchaConfig = {
  apiKey: process.env.TWO_CAPTCHA_API_KEY,
  siteKey: process.env.RUNESCAPE_RECAPTCHA_SITE_KEY,
  options: {
    timeout: 80e3,
    polling: 5e3,
    throwErrors: true
  }
}

/**
 * Creates a {@link CaptchaSolver} instance
 * @param {twoCaptchaConfig} options override options
 * @returns {TwoCaptchaSolver}
 */
function buildTwoCaptchaSolver (config) {
  config = {
    ...twoCaptchaConfig,
    ...config,
    options: { ...twoCaptchaConfig.options, ...config.options }
  }

  return new TwoCaptchaSolver(
    new TwoCaptchaClient(config.apiKey, config.options),
    config.siteKey
  )
}

class TwoCaptchaSolver {
  /**
   *
   * @param {TwoCaptchaClient} client 2captcha client instance
   * @param {String} siteKey
   */
  constructor (client) {
    this.client = client
  }

  /**
   * Submit a request to the reCAPTCHA solving API
   *
   * @param {String} pageUrl Web page to get recaptcha token for
   * @param {String} siteKey reCAPTCHA siteKey value for the specified page
   * @param {String} proxyUrl
   * @returns {Promise<Object>} captcha response
   */
  async submit (pageUrl, siteKey, proxyUrl = null) {
    const config = {
      pageurl: pageUrl,
      googlekey: siteKey
    }

    if (proxyUrl !== null) {
      debug('proxy url', proxyUrl)
      const proxyOptions = {
        username: proxyUrl.username,
        password: proxyUrl.password,
        ip: proxyUrl.hostname,
        port: proxyUrl.port
      }

      const proxyType = proxyUrl.protocol.replace(/:$/, '').toUpperCase()

      debug('Using proxy', { proxyType, ...proxyOptions })
      config.proxyurl = formatProxyUrl(proxyOptions)
      config.proxytype = proxyType
    }

    debug('Submitting captcha solving request', config)

    const token = await this.client.decodeRecaptchaV2(config)
    debug('Received response from 2captcha', token)

    return token
  }
}

module.exports = {
  buildTwoCaptchaSolver,
  TwoCaptchaSolver
}
