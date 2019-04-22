class FormInputError extends Error {
  constructor (inputName, warning, rawHtml = null) {
    super(`Invalid input for "${inputName}" with error: "${warning}"`)

    this.inputName = inputName
    this.warning = warning
    this.rawHtml = rawHtml
  }
}

module.exports = FormInputError
