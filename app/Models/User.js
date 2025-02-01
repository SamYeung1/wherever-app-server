'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname,'./Base/BaseModel'))
const UserValidator = require(path.join(__dirname,'../Validators/UserProfile'))

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends BaseModel {
  static boot () {
    super.boot()
    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
        userInstance.is_verify = userInstance.is_verify ? userInstance.is_verify : false
    })

  }
  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token','_id','user_id')
  }
  profile(){
    return this.hasOne('App/Models/Profile','_id','user_id')
  }
  friends(){
    return this.hasMany('App/Models/Friend','_id','user_id')
  }
  traces(){
    return this.hasMany('App/Models/Trace','_id','user_id')
  }
}

module.exports = User
