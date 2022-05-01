const {
  albumSchema,
  songSchema,
  userSchema
} = require('./schema')

const InvariantError = require('../../exceptions/InvariantError')

const PayloadValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateSongPayload: (payload) => {
    const validationResult = songSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateUserPayload: (payload) => {
    const validationResult = userSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = PayloadValidator
