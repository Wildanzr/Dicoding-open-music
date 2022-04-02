const ClientError = require('../../exceptions/ClientError')
const { failResponse, successResponse } = require('../../utils/response/index')

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
      // Beautify error message
      const message = error.message.replace(/['"]+/g, '')

      // Check if error is a ClientError
      if (error instanceof ClientError) {
        // Make response object
        const res = failResponse('fail', message)
        const response = h.response(res)
        response.code(error.statusCode)

        return response
      }

      // Make response object
      const res = failResponse('error', message)
      const response = h.response(res)
      response.code(500)

      console.error(error)
      return response
    }
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    try {
      // Call service getAlbumById
      let album = await this._service.getAlbumById(id)

      // Map album to response object
      album = {
        id: album.id,
        name: album.name,
        year: album.year
      }

      // Make response object
      const res = successResponse(null, { album })
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      // Beautify error message
      const message = error.message.replace(/['"]+/g, '')

      // Check if error is a ClientError
      if (error instanceof ClientError) {
        // Make response object
        const res = failResponse('fail', message)
        const response = h.response(res)
        response.code(error.statusCode)

        return response
      }

      // Make response object
      const res = failResponse('error', message)
      const response = h.response(res)
      response.code(500)

      console.error(error)
      return response
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
      // Beautify error message
      const message = error.message.replace(/['"]+/g, '')

      // Check if error is a ClientError
      if (error instanceof ClientError) {
        // Make response object
        const res = failResponse('fail', message)
        const response = h.response(res)
        response.code(error.statusCode)

        return response
      }

      // Make response object
      const res = failResponse('error', message)
      const response = h.response(res)
      response.code(500)

      console.error(error)
      return response
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
      // Beautify error message
      const message = error.message.replace(/['"]+/g, '')

      // Check if error is a ClientError
      if (error instanceof ClientError) {
        // Make response object
        const res = failResponse('fail', message)
        const response = h.response(res)
        response.code(error.statusCode)

        return response
      }

      // Make response object
      const res = failResponse('error', message)
      const response = h.response(res)
      response.code(500)

      console.error(error)
      return response
    }
  }
}

module.exports = AlbumHandler
