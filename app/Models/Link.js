'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname,'./Base/BaseModel'))
class Link extends BaseModel {
  baseLink(){
    return this.hasOne('App/Models/BaseLink','base_link_key','key')
  }
}

module.exports = Link
