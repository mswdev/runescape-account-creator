const Joi = require('@hapi/joi')

/**
 * Joi validation schema for the registration form
 */
const RegisterFormSchema = Joi.object().keys({
  email1: Joi.string().email(),
  onlyOneEmail: Joi.string().equal('1'),
  password1: Joi.string().min(5).max(20).regex(/^[\w\d]+$/),
  onlyOnePassword: Joi.string().equal('1'),
  day: Joi.number().min(1),
  month: Joi.number().min(1).max(12),
  year: Joi.number().min(1900).max(2006),
  'create-submit': Joi.string().equal('create'),
  'g-recaptcha-response': Joi.string()
})

function validateRegistrationForm (form) {
  return Joi.validate(form, RegisterFormSchema)
}

module.exports = validateRegistrationForm
