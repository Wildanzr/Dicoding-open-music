const Joi = require('joi')

// Validation max year
const currYear = new Date().getFullYear()

// Album schema
const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
})

// Song schema
const songSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currYear).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string()
})

// User schema, note min 3 is for adaption with postman test
const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(3).required(),
  fullname: Joi.string().required()
})

// Authentication schema
const authSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(3).required()
})

// Request new token schema
const requestTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
})

// Delete token schema
const deleteTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
})

module.exports = {
  albumSchema,
  songSchema,
  userSchema,
  authSchema,
  requestTokenSchema,
  deleteTokenSchema
}
