/* eslint-disable camelcase */

exports.up = pgm => {
  // Create table
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })

  // Add foreign key
  pgm.addConstraint('collaborations', 'fk_collaborations_playlist_id_playlists.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('collaborations', 'fk_collaborations_user_id_users.id', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  // Drop table
  pgm.dropTable('collaborations')
}
