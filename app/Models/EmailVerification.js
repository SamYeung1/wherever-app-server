'use strict'
const path = require('path')
const BaseModel = require(path.join(__dirname,'./Base/BaseModel'))

class EmailVerification extends BaseModel {
  static get objectIDs() {
    return ['_id', 'user_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }
}

module.exports = EmailVerification
