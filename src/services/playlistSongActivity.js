const { Pool } = require('pg')
const { nanoid } = require('nanoid')

class PlaylistSongActivity {
  constructor (playlistService) {
    this._pool = new Pool()
    this._playlistService = playlistService
  }

  async recordAdd (playlistId, songId, userId) {
    const id = `activity-${nanoid(16)}`
    const now = new Date()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, 'add', now]
    }

    await this._pool.query(query)
    await this._playlistService.updatePlaylistActivity(playlistId, now)
  }

  async recordDelete (playlistId, songId, userId) {
    const id = `activity-${nanoid(16)}`
    const now = new Date()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, 'delete', now]
    }

    await this._pool.query(query)
    await this._playlistService.updatePlaylistActivity(playlistId, now)
  }

  async getAllActivityFromPlaylist (playlistId) {
    const query = {
      text: 'SELECT us.username, sg.title, ac.action, ac.time FROM playlist_song_activities ac INNER JOIN users us ON us.id = ac.user_id INNER JOIN songs sg ON sg.id = ac.song_id WHERE ac.playlist_id = $1',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = PlaylistSongActivity
