'use strict'

const path = require('path')
const UserProfile = use('App/Models/Profile')
const BaseModel = require(path.join(__dirname,'./Base/BaseModel'))

class TraceComment extends BaseModel {
  static get objectIDs() {
    return ['_id', 'user_id','trace_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }
  trace() {
    return this.belongsTo('App/Models/Trace', 'trace_id', '_id').where('is_deleted', false)
  }
  static async createAPIModel(data,authUser){
    let model = {}
    model['id'] = data['_id']
    model['message'] = data['message']
    model['type'] = data['type']
    model['user'] = await UserProfile.createAPIModel(data['user'])
    model['post_date'] = data['updated_at']
    model['is_edited'] = data['is_edited']
    model['is_me'] = data['user_id'].toString() === authUser._id.toString()
    return model
  }
}

module.exports = TraceComment
