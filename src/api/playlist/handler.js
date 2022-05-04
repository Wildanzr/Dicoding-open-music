const { successResponse } = require('../../utils/response/index')

class PlaylistHandler {
  constructor (service, songService, playlistSongService, validator) {
    this._service = service
    this._songService = songService
    this._playlistSongService = playlistSongService
    this._validator = validator

    this.createPlaylist = this.createPlaylist.bind(this)
    this.getAllPlaylists = this.getAllPlaylists.bind(this)
    this.deletePlaylist = this.deletePlaylist.bind(this)
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this)
    this.getPlaylistSongs = this.getPlaylistSongs.bind(this)
    this.deleteSongFromPlaylist = this.deleteSongFromPlaylist.bind(this)
  }

  async createPlaylist (request, h) {
    const payload = request.payload

    try {
      // Get id from auth token
      const { id: userId } = request.auth.credentials

      // Validate palyload
      this._validator.validateCreatePlaylistPayload(payload)

      // Call service create playlist
      const playlistId = await this._service.createPlaylist(payload.name, userId)

      // Response object
      const res = successResponse(null, { playlistId })
      const response = h.response(res)
      response.statusCode = 201

      return response
    } catch (error) {
      return error
    }
  }

  async getAllPlaylists (request, h) {
    try {
      // Get id from auth token
      const { id: userId } = request.auth.credentials

      // Call service get all playlists with owner
      const playlists = await this._service.getAllPlaylistsWithOwner(userId)

      // Call service get all playlist with collaborator
      const collaborators = await this._service.getAllPlaylistWithCollaborator(userId)

      // Add playlist with collaborator to playlists
      playlists.push(...collaborators)

      // Response object
      const res = successResponse(null, { playlists })
      const response = h.response(res)
      response.statusCode = 200

      return response
    } catch (error) {
      return error
    }
  }

  async deletePlaylist (request, h) {
    const { id } = request.params

    try {
      // Get id from auth token
      const { id: userId } = request.auth.credentials

      // Validate payload
      await this._validator.validateDeletePlaylistPayload({ id })

      // Call service delete playlist
      await this._service.deletePlaylist(id, userId)
      await this._playlistSongService.removeAllSongFromPlaylist(id)

      // Response object
      const res = successResponse('Delete playlist success')
      const response = h.response(res)
      response.statusCode = 200

      return response
    } catch (error) {
      return error
    }
  }

  async addSongToPlaylist (request, h) {
    const payload = request.payload
    const { id } = request.params

    try {
      // Get id from auth token
      const { id: userId } = request.auth.credentials

      // Destructure payload
      const { songId } = payload

      // Validate payload and params
      await this._validator.validateAddSongToPlaylist({ id, songId })

      // Verify owner or collaborator
      await this._service.verifyPlaylistAccess(id, userId)

      // Make sure the song is exist
      await this._songService.getSongById(songId)

      // Call service add SongToPlaylist
      await this._playlistSongService.addSongToPlaylist(id, songId)

      const res = successResponse('Add song to current playlist success')
      const response = h.response(res)
      response.statusCode = 201

      return response
    } catch (error) {
      return error
    }
  }

  async getPlaylistSongs (request, h) {
    const { id } = request.params

    try {
      // Get id from auth token
      const { id: userId } = request.auth.credentials

      // Validate payload
      this._validator.validateGetPlaylistSongs({ id })

      // Call service get playlist detail
      const playlist = await this._service.getPlaylistDetails(id, userId)
      const songs = await this._playlistSongService.getAllSongFromPlaylist(id)

      // Add songs in playlist payload
      playlist.songs = songs

      // Response object
      const res = successResponse(null, { playlist })
      const response = h.response(res)
      response.statusCode = 200

      return response
    } catch (error) {
      return error
    }
  }

  async deleteSongFromPlaylist (request, h) {
    const payload = request.payload
    const { id } = request.params

    try {
      // Get id from auth token
      const { id: userId } = request.auth.credentials

      // Destructure payload
      const { songId } = payload

      // Validate payload and params
      await this._validator.validateDeleteSongFromPlaylist({ id, songId })

      // Verify owner or collaborator
      await this._service.verifyPlaylistAccess(id, userId)

      // Call service delete song from playlist
      await this._playlistSongService.deleteSongFromPlaylist(id, songId)

      const res = successResponse('Delete song from current playlist success')
      const response = h.response(res)
      response.statusCod = 200

      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = PlaylistHandler
