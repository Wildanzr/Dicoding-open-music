const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const InvariantError = require('../exceptions/InvariantError')

class PlaylistSongService {
  constructor () {
    this._pool = new Pool()
  }

  async addSongToPlaylist (playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`
    const now = new Date()

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, playlistId, songId, now]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) throw InvariantError('Failed to add song in current playlist')

    return result.rows[0].id
  }

  async deleteSongFromPlaylist (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId]
    }

    await this._pool.query(query)
  }

  async removeAllSongFromPlaylist (playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId]
    }

    await this._pool.query(query)
  }

  async getAllSongFromPlaylist (playlistId) {
    const query = {
      text: 'SELECT sg.id, sg.title, sg.performer FROM playlist_songs ps INNER JOIN songs sg ON ps.song_id = sg.id WHERE ps.playlist_id = $1',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = PlaylistSongService
