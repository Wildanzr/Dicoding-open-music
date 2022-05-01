const AuthHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authService,
    userService,
    tokenize,
    validator
  }) => {
    const authenticaionHandler = new AuthHandler(
      authService,
      userService,
      tokenize,
      validator
    )

    server.route(routes(authenticaionHandler))
  }
}
