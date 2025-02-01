'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))

class Announcement extends BaseModel {

  static async createAPIModel(data, lang) {
    let model = {}
    model['id'] = data['_id']
    model['banner'] = data['banner'] ? `${Env.get('STORAGE_PATH')}${data['banner']}` : null
    model['title'] = data['details'].find((detail) =>
      detail.lang === lang
    )['title']
    model['content'] = data['details'].find((detail) =>
      detail.lang === lang
    )['content']
    model['post_date'] = data['created_at']
    return model
  }
}

module.exports = Announcement
