const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.addCollaborations,
    options: {
      auth: 'jwt_auth'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborations,
    options: {
      auth: 'jwt_auth'
    }
  }
]

module.exports = routes
