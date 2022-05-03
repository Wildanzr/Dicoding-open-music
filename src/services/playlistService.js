const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const SongService = require('./songService')
const PlaylistSongService = require('./playlistSongService')

const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')
const AuthorizationError = require('../exceptions/AuthorizationError')

class PlaylistService {
  constructor () {
    this._pool = new Pool()
    this._playlistSongService = new PlaylistSongService()
    this._songService = new SongService()
  }

  async createPlaylist (name, userId) {
    const id = `playlist-${nanoid(16)}`
    const now = new Date()

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, userId, now]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) throw new InvariantError('Fail to create playlist')

    return result.rows[0].id
  }

  async getPlaylistDetails (id, userId) {
    // Verify owner or collaborator
    await this.verifyPlaylistAccess(id, userId)

    const query = {
      text: 'SELECT pl.id, pl.name, us.username FROM playlists pl INNER JOIN users us ON pl.owner = us.id WHERE pl.id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new NotFoundError('No playlist found')

    return result.rows[0]
  }

  async getAllPlaylistsWithOwner (userId) {
    const query = {
      text: 'SELECT pl.id, pl.name, us.username FROM playlists pl INNER JOIN users us ON pl.owner = us.id WHERE pl.owner = $1',
      values: [userId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new NotFoundError('No playlists found')

    return result.rows
  }

  async deletePlaylist (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id]
    }

    await this._pool.query(query)
    await this._playlistSongService.removeAllSongFromPlaylist(id)
  }

  async addSongToPlaylist (playlistId, songId, userId) {
    // Verify owner or collaborator
    await this.verifyPlaylistAccess(playlistId, userId)
    // Make sure the song is exist
    await this._songService.getSongById(songId)
    return await this._playlistSongService.addSongToPlaylist(playlistId, songId)
  }

  async deleteSongFromPlaylist (playlistId, songId) {
    return await this._playlistSongService.deleteSongFromPlaylist(playlistId, songId)
  }

  async getAllSongInCurrentPlaylist (id) {
    return await this._playlistSongService.getAllSongFromPlaylist(id)
  }

  async verifyPlaylistOwner (playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new NotFoundError('No playlist found')

    if (result.rows[0].owner !== userId) throw new AuthorizationError('You are not the owner of this playlist')
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      throw error
    }
  }
}

module.exports = PlaylistService
