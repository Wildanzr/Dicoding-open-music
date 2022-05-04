const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const InvariantError = require('../exceptions/InvariantError')
const AuthorizationError = require('../exceptions/AuthorizationError')

class CollaborationService {
  constructor () {
    this._pool = new Pool()
  }

  async addCollaborator (playlistId, userId) {
    const id = `collab-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) throw new InvariantError('Failed to add collaborator')

    return result.rows[0].id
  }

  async removeCollaborator (playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }

    await this._pool.query(query)
  }

  async verifyPlaylistCollaborator (playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new AuthorizationError('You are not a collaborator of this playlist')
  }
}

module.exports = CollaborationService
