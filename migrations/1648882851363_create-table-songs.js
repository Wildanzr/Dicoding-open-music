/* eslint-disable camelcase */

exports.up = pgm => {
  // Create table
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
      default: null
    },
    album_id: {
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

  // Add foreign key
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE')
}

exports.down = pgm => { pgm.dropTable('songs') }
