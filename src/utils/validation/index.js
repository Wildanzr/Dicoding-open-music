const {
  albumSchema,
  songSchema,
  userSchema,
  authSchema,
  requestTokenSchema,
  deleteTokenSchema,
  createPlaylistSchema,
  deletePlaylistSchema,
  addSongToPlaylist,
  getPlaylistSongs,
  deletSongFromPlaylist,
  collaborationSchema,
  playlistActivitySchema
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
  },

  validateCreatePlaylistPayload: (payload) => {
    const validationResult = createPlaylistSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateDeletePlaylistPayload: (payload) => {
    const validationResult = deletePlaylistSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateAddSongToPlaylist: (payload) => {
    const validationResult = addSongToPlaylist.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateDeleteSongFromPlaylist: (payload) => {
    const validationResult = deletSongFromPlaylist.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateGetPlaylistSongs: (payload) => {
    const validationResult = getPlaylistSongs.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validateCollaborationPayload: (payload) => {
    const validationResult = collaborationSchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },

  validatePlaylistActivityPayload: (payload) => {
    const validationResult = playlistActivitySchema.validate(payload)

    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = PayloadValidator
