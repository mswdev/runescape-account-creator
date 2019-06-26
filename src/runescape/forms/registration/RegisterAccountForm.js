const url = require('url')
const request = require('request-promise')
const debug = require('debug')('account-creator:register-form')
const httpsSocksAgent = require('socks-proxy-agent')
const detectFormErrors = require('./errors')
const validateRegistrationForm = require('./validation')

/**
 * Account registration form object.
 *
 * Handles validation and submission to the registration URL provided.
 */
class RegisterAccountForm {
  /** @param {String} registerUrl */
  constructor(registerUrl) {
    /**
     * The form object that was submitted.
     *
     * @type {boolean|Object}
     */
    this.submitted = null
    /**
     * Email to use to register the account
     *
     * @type {String}
     */
    this.email = ''
    /**
     * Array of errors found in the HTTP Response body
     *
     * @type {Array<Object>}
     */
    this.errors = []
    /**
     * The proxy to use when registering for the account.
     *
     * Note: only SOCKSv5 proxies are supported currently.
     *
     * @type {url.URL}
     */
    this.proxy = null
    /**
     * RuneScape account registration form URL
     *
     * @type {String}
     */
    this.registerUrl = registerUrl
    /**
     * Can be specified to set the HTTP User-Agent header when submitting the account form
     *
     * @type {String}
     */
    this.userAgent = null
    /**
     * Defaults to Unix Epoch.
     *
     * @type {Date}
     */
    this.birthday = new Date(0)
    /**
     * Needs to be set in order to successfully submit the form
     *
     * @type {String}
     */
    this.recaptchaToken = ''
  }

  get form() {
    return {
      email1: this.email,
      onlyOneEmail: '1',
      password1: this.password,
      onlyOnePassword: '1',
      day: this.birthday.getDate(),
      year: this.birthday.getFullYear(),
      // gotta love how consistent JavaScript is
      month: this.birthday.getMonth() + 1,
      'create-submit': 'create',
      'g-recaptcha-response': this.recaptchaToken
    }
  }

  /** @param {Object} */
  set credentials({email, password}) {
    this.email = email
    this.password = password
  }

  /**
   * The created account
   */
  get account() {
    if (!this.submitted) {
      return null
    }

    return {
      birthday: this.birthday,
      credentials: {
        email: this.submitted.email1,
        password: this.submitted.password1
      },
      proxy: this.proxy === null ? null : url.format(this.proxy, {search: false, fragment: false}),
      meta: {
        userAgent: this.userAgent
      }
    }
  }

  /**
   * Submit the form and attempt to register the account.
   *
   * @returns {Object} The submitted form's value at time of submission
   * @throws {FormInputError}
   */
  async submit() {
    if (this.submitted) throw new Error('Already submitted this form')

    if (!this.recaptchaToken) {
      throw new Error('recaptchaToken was not set!')
    }

    const form = this.form
    const options = {
      method: 'POST',
      url: this.registerUrl,
      followAllRedirects: true,
      form,
      headers: {
        'User-Agent': this.userAgent
      }
    }

    if (this.proxy !== null) {
      debug('Using proxy:', url.format(this.proxy, {
        search: false,
        fragment: false
      }))

      options.agent = new httpsSocksAgent(url.format(this.proxy, {
        search: false,
        fragment: false
      }))
    }

    try {
      debug('Submitting registration form', form)
      this.submitted = form
      const responseHtml = await request(options)

      debug('Checking for form errors in response HTML')
      this.errors = detectFormErrors(responseHtml)

      debug('Registration finished!', this.account)
      return this.account
    } catch (error) {
      throw error
    }
  }

  /**
   * Validate the form contents against known validation parameters
   *
   * @see {validateRegistrationForm}
   * @returns {Promise}
   */
  validate() {
    return validateRegistrationForm(this.form)
  }
}

module.exports = RegisterAccountForm
