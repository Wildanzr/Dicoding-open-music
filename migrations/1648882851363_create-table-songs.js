/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    duration: {
      type: 'INTEGER',
      default: 120
    },
    albumId: {
      type: 'VARCHAR(50)',
      default: null
    },
    created_at: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = pgm => { pgm.dropTable('songs') }
