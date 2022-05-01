const { successResponse } = require('../../utils/response')

class UserHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addUserHandler = this.addUserHandler.bind(this)
  }

  // Add user
  async addUserHandler (request, h) {
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateUserPayload(payload)

      // Destructure payload
      const { username, password, fullname } = payload

      // Call servie addUser
      const userId = await this._service.addUser({ username, password, fullname })

      // Make response object
      const res = successResponse(null, { userId })
      const response = h.response(res)
      response.code(201)

      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = UserHandler
