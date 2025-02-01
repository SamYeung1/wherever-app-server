'use strict'

const path = require('path')
const UserProfile = use('App/Models/Profile')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))

class Request extends BaseModel {

  static get objectIDs() {
    return ['_id', 'user_id', 'source_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }

  source() {
    if (this.type === 'FRIEND') {
      return this.belongsTo('App/Models/Profile', 'source_id', 'user_id').where('is_deleted', false)
    }
  }
  static async createAPIModel(data){
    let model = {};
    model['id'] = data['_id'];
    model['source'] = null;
    if(data['type'] === 'FRIEND'){
      model['source'] =await UserProfile.createAPIModel(data['source']);
    }
    model['user'] = await UserProfile.createAPIModel(data['user']);
    model['type'] = data['type'];
    model['post_date'] = data['updated_at'];
    return model;
  }
}

module.exports = Request
