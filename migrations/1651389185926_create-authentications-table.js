/* eslint-disable camelcase */

exports.up = pgm => {
  // Create extension if note exists
  pgm.createExtension('uuid-ossp', { ifNotExists: true })

  pgm.createTable('authentications', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    token: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('authentications')
}
