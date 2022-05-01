const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.authHandler
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.requestNewTokenHandler
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.logoutHandler
  }
]

module.exports = routes
