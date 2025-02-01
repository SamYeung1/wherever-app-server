'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname,'./Base/BaseModel'))

class Inbox extends BaseModel {
  link() {
    return this.hasOne('App/Models/Link', 'link_key', 'key').where('is_deleted', false).with(['baseLink'])
  }
}

module.exports = Inbox
