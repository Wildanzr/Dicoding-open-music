const {
  albumSchema,
  songSchema,
  userSchema,
  authSchema,
  requestTokenSchema,
  deleteTokenSchema
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
  },

  validateAuthPayload: (payload) => {
    const validationResult = authSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateRequestTokenPayload: (payload) => {
    const validationResult = requestTokenSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateDeleteTokenPayload: (payload) => {
    const validationResult = deleteTokenSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = PayloadValidator
