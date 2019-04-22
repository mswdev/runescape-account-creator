const cheerio = require('cheerio')

/**
 * Checks the HTML for known CSS selectors designating warning and errors
 *
 * @param {String} responseHtml Form response HTML
 * @throws {FormInputError} if a known error is present in the HTML
 * @returns {void}
 */
function findFormErrorElements (html) {
  const $ = cheerio.load(html)
  const warnings = $('p.m-callout--type-warning').map((_, warning) => {
    const inputName = warning.parent().find('input').attr('name')
    const text = warning.contents().not('a, strong').text().trim()

    return { inputName, text, html: warning.html().trim }
  })

  return warnings
}

module.exports = findFormErrorElements
