const Jwt = require('@hapi/jwt')
const InvariantError = require('../../exceptions/InvariantError')

const Tokenize = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (token) => {
    try {
      // Decode token
      const artifacts = Jwt.token.decode(token)

      // Verify token
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY)

      // Destructure artifacts
      const { payload } = artifacts.decoded

      return payload
    } catch (error) {
      throw new InvariantError('Invalid refresh token')
    }
  }
}

module.exports = Tokenize
