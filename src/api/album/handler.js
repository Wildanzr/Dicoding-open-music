const { successResponse } = require('../../utils/response/index')

class AlbumHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addAlbumHandler = this.addAlbumHandler.bind(this)
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
    this.updateAlbumHandler = this.updateAlbumHandler.bind(this)
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this)
  }

  // Add album
  async addAlbumHandler (request, h) {
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateAlbumPayload(payload)

      // Destructure payload
      const { name, year } = request.payload

      // Call service addAlbum
      const albumId = await this._service.addAlbum({ name, year })

      // Make response object
      const res = successResponse(null, { albumId })
      const response = h.response(res)
      response.code(201)

      return response
    } catch (error) {
      return error
    }
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    try {
      // Call service getAlbumById
      let album = await this._service.getAlbumById(id)

      // Check if any song exist in album
      const songs = await this._service.checkIfAnySongExistByAlbumId(id)
      if (songs) {
        // There is at least one song in album
        // Call service getSongByAlbumId
        const songs = await this._service.getSongByAlbumId(id)
        album = {
          id: album.id,
          name: album.name,
          year: album.year,
          songs: songs
        }
      } else {
        // There is no song in album yet
        // Map album to response object
        album = {
          id: album.id,
          name: album.name,
          year: album.year
        }
      }

      // Make response object
      const res = successResponse(null, { album })
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }

  async updateAlbumHandler (request, h) {
    const { id } = request.params
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateAlbumPayload(payload)

      // Destructure payload
      const { name, year } = request.payload

      // Call service updateAlbum
      await this._service.updateAlbum(id, { name, year })

      // Make response object
      const res = successResponse('Album updated successfully')
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }

  async deleteAlbumHandler (request, h) {
    const { id } = request.params
    try {
      // Call service deleteAlbum
      await this._service.deleteAlbum(id)

      // Make response object
      const res = successResponse('Album deleted successfully')
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = AlbumHandler
