'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))
const Env = use('Env')
const UploaderService = use('App/Services/UploaderService')

class Profile extends BaseModel {
  static get objectIDs() {
    return ['_id', 'user_id']
  }

  static boot() {
    super.boot()
    this.addTrait('ProfileTrait')
  }

  user() {
    return this.belongsTo('App/Models/User', 'user_id', '_id')
  }

  static async createAPIModel(data) {
    let model = {};
    model['id'] = data['user_id'];
    model['display_name'] = data['display_name'];
    model['account_id'] = data['account_id'];
    model['icon'] = data['icon'] ? await UploaderService.getUrl(data['icon']) : null;
    model['profile_icon'] = data['profile_icon'] ? await UploaderService.getUrl(data['profile_icon']) : null;
    model['about_me'] = data['about_me'] ? data['about_me'] : null;
    return model;
  }
}

module.exports = Profile
