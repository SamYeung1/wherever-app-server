'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UserVerifyException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(4005,null)
  }
}

module.exports = UserVerifyException
