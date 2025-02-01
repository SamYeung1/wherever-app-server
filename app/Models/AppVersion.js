'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname,'./Base/BaseModel'))

class AppVersion extends BaseModel {
  // static createAPIModel(data) {
  //   let model = {}
  //   model['id'] = data['_id']
  //   model['platform'] = data['platform']
  //   model['version'] = data['version']
  //   model['is_force'] = data['is_force']
  //   return model
  // }
}

module.exports = AppVersion
