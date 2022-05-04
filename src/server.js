require('dotenv').config()

// Hapi
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

// Plugins
const albums = require('./api/album/index')
const songs = require('./api/music/index')
const users = require('./api/user/index')
const authentications = require('./api/authentication/index')
const playlists = require('./api/playlist/index')

// Validator
const PayloadValidator = require('./utils/validation/index')

// Service
const AlbumService = require('./services/albumService')
const SongService = require('./services/songService')
const UserService = require('./services/userService')
const AuthService = require('./services/authService')
const PlaylistService = require('./services/playlistService')
const PlaylistSongService = require('./services/playlistSongService')

// Exception
const ClientError = require('./exceptions/ClientError')

// Utils
const { failResponse } = require('./utils/response/index')
const Tokenize = require('./utils/token/tokenize')

const init = async () => {
  const albumService = new AlbumService()
  const songService = new SongService()
  const userService = new UserService()
  const authService = new AuthService()
  const playlistSongService = new PlaylistSongService()
  const playlistService = new PlaylistService()

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
      plugin: Jwt
    }
  ])

  server.auth.strategy('jwt_auth', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.userId
      }
    })
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
    },
    {
      plugin: authentications,
      options: {
        authService,
        userService,
        tokenize: Tokenize,
        validator: PayloadValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        songService,
        playlistSongService,
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

      if (response.output.statusCode === 401) newResponse.code(401)
      else newResponse.code(500)

      return newResponse
    }

    // If response is not instance of ClientError or Error
    return response.continue || response
  })

  await server.start()

  console.log(`Server running on ${server.info.uri}`)
}

init()
