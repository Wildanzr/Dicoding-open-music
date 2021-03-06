const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')
const AuthorizationError = require('../exceptions/AuthorizationError')

class PlaylistService {
  constructor (collaborationService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
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

    return result.rows
  }

  async getAllPlaylistWithCollaborator (userId) {
    const query = {
      text: 'SELECT pl.id, pl.name, us.username FROM playlists pl INNER JOIN collaborations cl ON cl.playlist_id = pl.id INNER JOIN users us ON us.id = pl.owner WHERE cl.user_id = $1',
      values: [userId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async deletePlaylist (id, userId) {
    // Verify owner
    await this.verifyPlaylistOwner(id, userId)

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id]
    }

    await this._pool.query(query)
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

      try {
        await this._collaborationService.verifyPlaylistCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }

  async checkPlaylistIsExistAndTheOwner (playlistId, collaboratorId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new NotFoundError('No playlist found')

    if (result.rows[0].owner !== userId) throw new AuthorizationError('You are not the owner of this playlist')

    if (result.rows[0].owner === collaboratorId) throw new InvariantError('You cannot add or remove yourself as a collaborator')
  }

  async updatePlaylistActivity (playlistId, updateAt) {
    const query = {
      text: 'UPDATE playlists SET updated_at = $2 WHERE id = $1',
      values: [playlistId, updateAt]
    }

    await this._pool.query(query)
  }
}

module.exports = PlaylistService
