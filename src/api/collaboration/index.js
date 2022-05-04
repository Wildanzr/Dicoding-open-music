const CollaborationHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, userService, playlistService, validator }) => {
    const collaborationHandler = new CollaborationHandler(service, userService, playlistService, validator)
    server.route(routes(collaborationHandler))
  }
}
