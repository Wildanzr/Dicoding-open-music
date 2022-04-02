const ClientError = require('../../exceptions/ClientError')
const { failResponse, successResponse } = require('../../utils/response/index')

class AlbumHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addAlbumHandler = this.addAlbumHandler.bind(this)
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
}

module.exports = AlbumHandler
