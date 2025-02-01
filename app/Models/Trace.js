'use strict'

const _ = require('lodash')
const path = require('path')
const Env = use('Env')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))
const UploaderService = use("App/Services/UploaderService");
const UserProfile = use('App/Models/Profile')
const Tag = use('App/Models/Tag')

class Trace extends BaseModel {
  static boot() {
    super.boot()
    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (traceInstance) => {
      if (traceInstance.tags) {
        traceInstance.tags = traceInstance.tags.map((tag) => {
          let text = tag[0].toUpperCase() + tag.substr(1)
          return text
        })
      }
    })

  }

  static get geometries() {
    return ['_geo']
  }

  static get objectIDs() {
    return ['_id', 'user_id']
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }

  comments() {
    return this.hasMany('App/Models/Comment', '_id', 'trace_id').where('is_deleted', false)
  }

  toObject() {
    let object = super.toObject();
    object = _.omit(object, ['_geo'])
    return object
  }

  static async createAPIModel(data) {
    let model = {}
    model['id'] = data['_id']
    model['banners'] = await Promise.all(data['banners'].filter((banner) => banner.type === 'IMAGE_MOBILE').map(async (banner) => await UploaderService.getUrl(banner.path)))
    model['thumbnail'] = data['banners'].find((banner) => banner.type === 'IMAGE_THUMBNAIL').path ? await UploaderService.getUrl(data['banners'].find((banner) => banner.type === 'IMAGE_THUMBNAIL').path) : null
    model['title'] = data['title']
    model['description'] = data['description']
    model['longitude'] = data['longitude']
    model['latitude'] = data['latitude']
    model['tags'] = data['tags']
    model['user'] = await UserProfile.createAPIModel(data['user'])
    model['token_date'] = data['token_date'] ? new Date(data['token_date']).getTime() : data['created_at']
    model['post_date'] = data['updated_at']
    return model
  }
}

module.exports = Trace
