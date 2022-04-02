require('dotenv').config()
const Hapi = require('@hapi/hapi')

const albums = require('./api/album/index')
const songs = require('./api/music/index')
const PayloadValidator = require('./utils/validation/index')
const AlbumService = require('./services/albumService')
const SongService = require('./services/songService')

const init = async () => {
  const albumService = new AlbumService()
  const songService = new SongService()

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

  await server.register({
    plugin: songs,
    options: {
      service: songService,
      validator: PayloadValidator
    }
  })

  await server.start()

  console.log(`Server running on ${server.info.uri}`)
}

init()
