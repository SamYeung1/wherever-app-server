/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const moment = require('moment')
const Model = use('Model')
const _ = require('lodash')

class BaseModel extends Model {
  static boot() {
    super.boot()
    this.addTrait('Deletable')
  }

  toObject() {
    let object = Object.assign(super.toObject());
    object = _.omit(object,['is_deleted'])
    object['updated_at'] = new Date(object['updated_at']).getTime()
    object['created_at'] = new Date(object['created_at']).getTime()
    return object;
  }
}

module.exports = BaseModel
