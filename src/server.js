require('dotenv').config()
const Hapi = require('@hapi/hapi')

const albums = require('./api/album/index')
const PayloadValidator = require('./utils/validation/index')
const AlbumService = require('./services/albumService')

const init = async () => {
  const albumService = new AlbumService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: PayloadValidator
    }
  })

  await server.start()

  console.log(`Server running on ${server.info.uri}`)
}

init()
