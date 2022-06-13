const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.createPlaylist,
    options: {
      auth: 'jwt_auth'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getAllPlaylists,
    options: {
      auth: 'jwt_auth'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylist,
    options: {
      auth: 'jwt_auth'
    }
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.addSongToPlaylist,
    options: {
      auth: 'jwt_auth'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistSongs,
    options: {
      auth: 'jwt_auth'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongFromPlaylist,
    options: {
      auth: 'jwt_auth'
    }
  }
]

module.exports = routes
