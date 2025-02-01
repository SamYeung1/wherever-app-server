'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class BlackListException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(4006,null)
  }
}

module.exports = BlackListException
