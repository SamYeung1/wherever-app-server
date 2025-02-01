'use strict'

const path = require('path')
const UserProfile = use('App/Models/Profile')
const Trace = use('App/Models/Trace')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))

class TraceReactionHistory extends BaseModel {
  static get objectIDs() {
    return ['_id', 'user_id', 'trace_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id')
  }

  trace() {
    return this.belongsTo('App/Models/Trace', 'trace_id', '_id')
  }

  static async createAPIModel(data) {
    let model = {}
    model['user'] = await UserProfile.createAPIModel(data['user'])
    model['type'] = data['type']
    model['post_date'] = data['updated_at']
    return model
  }
}

module.exports = TraceReactionHistory
