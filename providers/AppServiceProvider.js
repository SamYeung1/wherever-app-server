'use strict'

const {ServiceProvider} = require('@adonisjs/fold')
const AppCst = require('../cst/appCst')
const _ = require('lodash')
const moment = require('moment')

class AppServiceProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    const Response = use('Adonis/Src/Response')
    const Request = use('Adonis/Src/Request')

    Response.macro('output', function (result = null, message = null) {
      return this.status(200).json({time: moment().toDate().getTime(), code: 2000, message: message, result: result})
    })
    Response.macro('outputWithPaging', function (results = null, total = 0,total_page = 0, message = null) {
      return this.status(200).json({
        time: moment().toDate().getTime(),
        code: 2000,
        message: message,
        result: {total: total,total_page:total_page, data: results}
      })
    })
    Response.macro('outputWithCode', function (code, result = null, message = null) {
      return this.status(200).json({
        time: moment().toDate().getTime(),
        code: parseInt(code),
        message: message,
        result: result
      })
    })
    Response.macro('outputWithCode401', function (code, result = null, message = null) {
      return this.status(401).json({
        time: moment().toDate().getTime(),
        code: parseInt(code),
        message: message,
        result: result
      })
    })
    Response.macro('rejectAuth', function () {
      return this.status(401).json({time: moment().toDate().getTime(), code: 401, message: null, result: null})
    })
    Request.macro('getLang', function (code, result = null, message = null) {
      return this.header(AppCst.Header.LANG)
    })
    Request.macro('getAPIToken', function (code, result = null, message = null) {
      return this.header(AppCst.Header.APIKEY)
    })
    Request.macro('getAppVersion', function (code, result = null, message = null) {
      return this.header(AppCst.Header.APPVERSION)
    })
  }
}

module.exports = AppServiceProvider
