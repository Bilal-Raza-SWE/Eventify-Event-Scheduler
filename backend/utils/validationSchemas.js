const Joi = require('joi');

const registrationSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    'string.empty': 'First name is required'
  }),
  lastName: Joi.string().trim().required().messages({
    'string.empty': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  role: Joi.string().valid('user', 'admin').default('user'),
   adminCode: Joi.string().optional().allow(null, '')

});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  }),
  role: Joi.string().valid('user', 'admin').default('user')
});

module.exports = {
  registrationSchema,
  loginSchema
};