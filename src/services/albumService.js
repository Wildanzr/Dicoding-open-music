const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')

class AlbumService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = `album-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }

    const res = await this._pool.query(query)

    if (!res.rows[0].id) throw new InvariantError('Fail to add album')

    return res.rows[0].id
  }

  async getAlbumById (id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('Album not found')

    return res.rows[0]
  }

  async updateAlbum (id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, new Date(), id]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('Fail to update album. Album not found.')
  }

  async deleteAlbum (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('Fail to delete album. Album not found.')
  }

  async checkIfAnySongExistByAlbumId (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id]
    }

    const res = await this._pool.query(query)

    if (res.rows.length) return true

    return false
  }

  async getSongByAlbumId (id) {
    const query = {
      text: 'SELECT id, title, year, genre, performer, duration FROM songs WHERE album_id = $1',
      values: [id]
    }

    const res = await this._pool.query(query)

    if (!res.rows.length) throw new NotFoundError('Album not found')

    return res.rows
  }
}

module.exports = AlbumService
