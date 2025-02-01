'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TraceSchema extends Schema {
  up () {
    this.collection('traces', (collection) => {
      collection.index('geo_index', {_geo: '2dsphere'})
    })
  }

  down () {

  }
}

module.exports = TraceSchema
