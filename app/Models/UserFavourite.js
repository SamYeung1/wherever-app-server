'use strict'
const path = require('path')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))
const Trace = use('App/Models/Trace')
const UserProfile = use('App/Models/Profile')

class UserFavourite extends BaseModel {
  static get objectIDs() {
    return ['_id', 'user_id', 'trace_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }


  trace() {
    return this.hasOne('App/Models/Trace', 'trace_id', '_id').with('user').where('is_deleted', false)
  }
  static async createAPIModel(data){
    let model = {}
    // model['id'] = data['_id']
    // model['trace'] = Trace.createAPIModel(data['trace'])
    // model['user'] = UserProfile.createAPIModel(data['user'])
    // model['post_date'] = data['updated_at']
    return await Trace.createAPIModel(data['trace'])
  }
}

module.exports = UserFavourite
