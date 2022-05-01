require('dotenv').config()
const Hapi = require('@hapi/hapi')

// Plugins
const albums = require('./api/album/index')
const songs = require('./api/music/index')
const users = require('./api/users/index')

// Validator
const PayloadValidator = require('./utils/validation/index')

// Service
const AlbumService = require('./services/albumService')
const SongService = require('./services/songService')
const UserService = require('./services/userService')

// Exception
const ClientError = require('./exceptions/ClientError')

// Utils
const { failResponse } = require('./utils/response/index')

const init = async () => {
  const albumService = new AlbumService()
  const songService = new SongService()
  const userService = new UserService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: PayloadValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: PayloadValidator
      }
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: PayloadValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    // If response is instance of ClientError
    if (response instanceof ClientError) {
      const res = failResponse('fail', response.message.replace(/['"]+/g, ''))
      const newResponse = h.response(res)

      newResponse.code(response.statusCode)
      return newResponse

      // If response is instance of Error
    } if (response instanceof Error) {
      const res = failResponse('error', response.message.replace(/['"]+/g, ''))
      const newResponse = h.response(res)

      newResponse.code(500)
      return newResponse
    }

    // If response is not instance of ClientError or Error
    return response.continue || response
  })

  await server.start()

  console.log(`Server running on ${server.info.uri}`)
}

init()
