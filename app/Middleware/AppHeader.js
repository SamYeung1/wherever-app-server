'use strict'
const _ = require('lodash')
const path = require('path')
const AppCst = require(path.join(__dirname,'../../cst/appCst'))
const APITokenService = use('App/Services/ApiTokenService')
const MissingHeaderException = use('App/Exceptions/MissingHeaderException')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AppHeader {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({request}, next) {
    const langKey = _.includes(Object.keys(request.headers()), AppCst.Header.LANG)
    const APIKey = _.includes(Object.keys(request.headers()), AppCst.Header.APIKEY)
    if (!langKey || !APIKey) {
      throw new MissingHeaderException()
    }
    const apiToken = await APITokenService.getAPITokenByToken(request.header(AppCst.Header.APIKEY))
    if (!apiToken) {
      throw new MissingHeaderException()
    }
    await next()
  }
}

module.exports = AppHeader
