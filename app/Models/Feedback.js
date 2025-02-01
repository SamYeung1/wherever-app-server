'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))

class Feedback extends BaseModel {

  static get objectIDs() {
    return ['_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }
  static async createAPIModel(data){
    let model = {};
    model['id'] = data['_id'];
    model['message'] = data['message'];
    model['user'] = await UserProfile.createAPIModel(data['user']);
    model['post_date'] = data['updated_at'];
    return model;
  }
}

module.exports = Feedback
