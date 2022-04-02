const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.addSongHandler
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllSongsHandler
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.updateSongHandler
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongHandler
  }
]

module.exports = routes
