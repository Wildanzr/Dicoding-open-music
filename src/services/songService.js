const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')

class SongService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId]
    }

    const res = await this._pool.query(query)

    if (!res.rows[0].id) throw new InvariantError('Fail to add song')

    return res.rows[0].id
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration FROM songs WHERE id = $1',
      values: [id]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('Song not found')

    return res.rows[0]
  }

  async getAllSongs () {
    const query = {
      text: 'SELECT id, title, performer FROM songs'
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('No songs found')

    return res.rows
  }

  async updateSong (id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('Fail to update song')
  }

  async deleteSong (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('Fail to delete song')
  }

  async querySongByTitle (title) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1)',
      values: [`%${title}%`]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('No songs found')

    return res.rows
  }

  async querySongByPerformer (performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE LOWER($1)',
      values: [`%${performer}%`]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('No songs found')

    return res.rows
  }

  async querySongByTitleAndPerformer (title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
      values: [`%${title}%`, `%${performer}%`]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('No songs found')

    return res.rows
  }
}

module.exports = SongService
