'use strict'

const path = require('path')
const UserProfile = use('App/Models/Profile')
const Trace = use('App/Models/Trace')
const TraceComment = use('App/Models/TraceComment')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))

class Report extends BaseModel {

  static get objectIDs() {
    return ['_id', 'user_id', 'source_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }

  source() {
    if (this.type === 'USER') {
      return this.belongsTo('App/Models/Profile', 'source_id', 'user_id').where('is_deleted', false)
    }else if (this.type === 'TRACE') {
      return this.belongsTo('App/Models/Trace', 'source_id', '_id').where('is_deleted', false)
    }else if (this.type === 'COMMENT') {
      return this.belongsTo('App/Models/TraceComment', 'source_id', '_id').where('is_deleted', false)
    }
  }
  static async createAPIModel(data){
    let model = {};
    model['id'] = data['_id'];
    model['source'] = null;
    if(data['type'] === 'USER'){
      model['source'] = await UserProfile.createAPIModel(data['source']);
    }else if(data['type'] === 'TRACE'){
      model['source'] = await Trace.createAPIModel(data['source']);
    }else if(data['type'] === 'COMMENT'){
      model['source'] = await TraceComment.createAPIModel(data['source']);
    }
    model['user'] = await UserProfile.createAPIModel(data['user']);
    model['type'] = data['type'];
    model['post_date'] = data['updated_at'];
    return model;
  }
}

module.exports = Report
