const { FormInputError } = require('../../../errors')
const invalidErrors = require('./constants').invalid
const successChecks = require('./constants').success
const findFormErrorElements = require('../DynamicFormErrors')
const debug = require('debug')('account-creator:register-form')

/**
 * Checks for known form error patterns in the response
 *
 * @param {String} responseHtml Form response HTML
 * @throws {FormInputError} if a known error is present in the HTML
 * @returns {void}
 */
function detectFormErrors (responseHtml) {
  const warnings = findFormErrorElements(responseHtml)

  if (warnings.length > 0) {
    debug('Found some warnings!', warnings)
    const w = warnings[0]
    throw new FormInputError(w.inputName, w.text, w.html)
  }

  debug('Sanity checking with known failure constants in HTML')
  const failedText = invalidErrors.find(s => responseHtml.includes(s))
  if (failedText) {
    debug('Found a bad known failure reply!', failedText)
    throw new Error(`Found a bad known failure reply: ${failedText}`)
  }

  debug('Error checks passed!')

  const successText = successChecks.find(s => responseHtml.includes(s))
  if (successText) {
    debug('We found a success text constant in the reply:', successText)
  } else {
    debug('Uh-oh! We did not find a success text in the reply.')
  }
}

module.exports = detectFormErrors
