const { successResponse } = require('../../utils/response/index')

class CollaborationHandler {
  constructor (service, userService, playlistService, validator) {
    this._service = service
    this._userService = userService
    this._playlistService = playlistService
    this._validator = validator

    this.addCollaborations = this.addCollaborations.bind(this)
    this.deleteCollaborations = this.deleteCollaborations.bind(this)
  }

  async addCollaborations (request, h) {
    const payload = request.payload

    try {
      // Get userId from token
      const { id: userId } = request.auth.credentials

      // Validate payload
      this._validator.validateCollaborationPayload(payload)

      // Destructure payload
      const { playlistId, userId: collaboratorId } = payload

      // Make sure user is exist
      await this._userService.checkUserIsExist(collaboratorId)

      // Make sure playlist is exist and not same as user's playlist
      await this._playlistService.checkPlaylistIsExistAndTheOwner(playlistId, collaboratorId, userId)

      // Call service add collaborator
      const collaborationId = await this._service.addCollaborator(playlistId, collaboratorId)

      // Response object
      const res = successResponse(null, { collaborationId })
      const response = h.response(res)
      response.statusCode = 201

      return response
    } catch (error) {
      return error
    }
  }

  async deleteCollaborations (request, h) {
    const payload = request.payload

    try {
      // Get userId from token
      const { id: userId } = request.auth.credentials

      // Validate payload
      this._validator.validateCollaborationPayload(payload)

      // Destructure payload
      const { playlistId, userId: collaboratorId } = payload

      // Make sure user is exist
      await this._userService.checkUserIsExist(collaboratorId)

      // Make sure playlist is exist and not same as user's playlist
      await this._playlistService.checkPlaylistIsExistAndTheOwner(playlistId, collaboratorId, userId)

      // Call service remove collaborator
      await this._service.removeCollaborator(playlistId, collaboratorId)

      // Response object
      const res = successResponse('Remove collaborator success')
      const response = h.response(res)
      response.statusCode = 200

      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = CollaborationHandler
