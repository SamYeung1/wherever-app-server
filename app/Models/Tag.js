'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))

class Tag extends BaseModel {
  static async createAPIModel(data,lang) {
    let model = {}
    model['title'] = data['title']
    return model
  }
}

module.exports = Tag
