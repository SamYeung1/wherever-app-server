'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class AuthExpiredException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode401(4002,null)
  }
}

module.exports = AuthExpiredException
