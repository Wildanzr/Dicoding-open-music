const { successResponse } = require('../../utils/response')

class AuthHandler {
  constructor (authService, userService, tokenize, validator) {
    this._authService = authService
    this._userService = userService
    this._tokenize = tokenize
    this._validator = validator

    this.authHandler = this.authHandler.bind(this)
    this.requestNewTokenHandler = this.requestNewTokenHandler.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  async authHandler (request, h) {
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateAuthPayload(payload)

      // Destructure payload
      const { username, password } = payload

      // Verify auth
      const userId = await this._userService.verifyUser({ username, password })

      // Create token
      const accessToken = this._tokenize.generateAccessToken({ userId })
      const refreshToken = this._tokenize.generateRefreshToken({ userId })

      // Add token to database
      await this._authService.addRefreshToken(refreshToken)

      // Response object
      const res = successResponse('Login success', { accessToken, refreshToken })
      const response = h.response(res)
      response.code(201)

      return response
    } catch (error) {
      return error
    }
  }

  async requestNewTokenHandler (request, h) {
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateRequestTokenPayload(payload)

      // Destructure payload
      const { refreshToken } = payload

      // Verify refresh token
      await this._authService.verifyRefreshToken(refreshToken)

      // Decode refresh token
      const { id } = this._tokenize.verifyRefreshToken(refreshToken)

      // Create new access token
      const accessToken = this._tokenize.generateAccessToken({ id })

      // Response object
      const res = successResponse('Request new token success', { accessToken })
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }

  async logoutHandler (request, h) {
    const payload = request.payload
    try {
      // Validate payload
      this._validator.validateDeleteTokenPayload(payload)

      // Destructure payload
      const { refreshToken } = payload

      // Verify refresh token
      await this._authService.verifyRefreshToken(refreshToken)

      // Delete refresh token
      await this._authService.deleteRefreshToken(refreshToken)

      // Response object
      const res = successResponse('Logout success')
      const response = h.response(res)
      response.code(200)

      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = AuthHandler
