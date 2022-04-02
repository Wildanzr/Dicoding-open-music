/* eslint-disable camelcase */
const mapAlbumToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapSongToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapSongsToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at
}) => ({
  id,
  title,
  performer
})

module.exports = { mapAlbumToModel, mapSongToModel, mapSongsToModel }
