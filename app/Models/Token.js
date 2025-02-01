'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  static get objectIDs() { return ['_id', 'user_id'] }
  
  user(){
    return this.belongsTo('App/Models/User','user_id','_id')
  }
}

module.exports = Token
