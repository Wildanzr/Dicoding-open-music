/* eslint-disable camelcase */

exports.up = pgm => {
  // Create table
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    action: {
      type: 'TEXT',
      notNull: true
    },
    time: {
      type: 'TEXT',
      notNull: true
    }
  })

  // Add foreign key
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities_playlists.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  // Drop table
  pgm.dropTable('playlist_song_activities')
}
