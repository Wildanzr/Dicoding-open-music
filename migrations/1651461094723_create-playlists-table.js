/* eslint-disable camelcase */

exports.up = pgm => {
  // Create table
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    created_at: {
      type: 'TEXT',
      notNull: true
    },
    updated_at: {
      type: 'TEXT',
      notNull: true
    }
  })

  // Add foreign key
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  // Drop table
  pgm.dropTable('playlists')
}
