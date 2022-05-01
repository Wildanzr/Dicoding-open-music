const { successResponse } = require('../../utils/response/index')

class SongHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addSongHandler = this.addSongHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this)
    this.updateSongHandler = this.updateSongHandler.bind(this)
    this.deleteSongHandler = this.deleteSongHandler.bind(this)
  }

  async addSongHandler (request, h) {
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateSongPayload(payload)

      // Destructure payload
      const { title, year, genre, performer, duration, albumId } = request.payload

      // Call service addSong
      const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })

      // Make response object
      const res = successResponse(null, { songId })
      const response = h.response(res)
      response.code(201)

      return response
    } catch (error) {
      return error
    }
  }

  async getSongByIdHandler (request, h) {
    const { id } = request.params
    try {
      // Call service getSongById
      const song = await this._service.getSongById(id)

      // Make response object
      const res = successResponse(null, { song })
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }

  async getAllSongsHandler (request, h) {
    const { title, performer } = request.query
    let songs
    try {
      if (title && performer) {
        // If title and performer are set, call service getAllSongsByTitleAndPerformer
        songs = await this._service.querySongByTitleAndPerformer(title, performer)
      } else if (title) {
        // If only title is set, call service getAllSongsByTitle
        songs = await this._service.querySongByTitle(title)
      } else if (performer) {
        // If only performer is set, call service getAllSongsByPerformer
        songs = await this._service.querySongByPerformer(performer)
      } else {
        // Call service getAllSongs
        songs = await this._service.getAllSongs()
      }

      // Make response object
      const res = successResponse(null, { songs })
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }

  async updateSongHandler (request, h) {
    const { id } = request.params
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateSongPayload(payload)

      // Destructure payload
      const { title, year, genre, performer, duration, albumId = null } = request.payload

      // Call service updateSong
      await this._service.updateSong(id, { title, year, genre, performer, duration, albumId })

      // Make response object
      const res = successResponse('Song updated successfully')
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }

  async deleteSongHandler (request, h) {
    const { id } = request.params
    try {
      // Call service deleteSong
      await this._service.deleteSong(id)

      // Make response object
      const res = successResponse('Song deleted successfully')
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = SongHandler
