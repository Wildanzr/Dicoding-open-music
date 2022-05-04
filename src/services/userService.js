const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')
const AuthenticationError = require('../exceptions/AuthenticationError')

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

  async verifyUser ({ username, password }) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new AuthenticationError('Invalid username or password')

    const user = result.rows[0]

    if (!(await bcrypt.compare(password, user.password))) throw new AuthenticationError('Invalid username or password')

    return user.id
  }

  async verifyUsername (username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rows.length > 0) throw new InvariantError('Username already exists')
  }

  async checkUserIsExist (id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new NotFoundError('User not found')
  }
}

module.exports = UserService
