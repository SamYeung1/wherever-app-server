'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname,'./Base/BaseModel'))

class Friend extends BaseModel {
  static get objectIDs() {
    return ['_id', 'user_id','related_user_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }
  relatedUser() {
    return this.belongsTo('App/Models/Profile', 'related_user_id', 'user_id').where('is_deleted', false)
  }
}

module.exports = Friend
