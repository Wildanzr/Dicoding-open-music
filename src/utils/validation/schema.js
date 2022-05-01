const Joi = require('joi')

// Validation max year
const currYear = new Date().getFullYear()

const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
})

const songSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currYear).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string()
})

module.exports = { albumSchema, songSchema }
