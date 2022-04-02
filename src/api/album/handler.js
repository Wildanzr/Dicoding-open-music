/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
const ClientError = require('../../exceptions/ClientError')

class AlbumHandler {
  constructor (service, validator) {
    this._service = service,
    this._validator = validator

    this._addAlbumHandler = this.addAlbumHandler.bind(this)
  }

  async addAlbumHandler (request, h) {
    return h.response({ status: 'success' })
  }
}

module.exports = AlbumHandler
