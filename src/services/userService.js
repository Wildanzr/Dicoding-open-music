const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const InvariantError = require('../exceptions/InvariantError')

class UserService {
  constructor () {
    this._pool = new Pool()
  }

  async addUser ({ username, password, fullname }) {
    // Verify username
    await this.verifyUsername(username)

    // Generate id, hash password, set created_at
    const id = `user-${nanoid(16)}`
    const passwordHash = await bcrypt.hash(password, 10)
    const createdAt = new Date()

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $5) RETURNING id',
      values: [id, username, passwordHash, fullname, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new InvariantError('Register fail')

    return result.rows[0].id
  }

  async verifyUsername (username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rows.length > 0) throw new InvariantError('Username already exists')
  }
}

module.exports = UserService
