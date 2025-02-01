'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class DuplicatedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(1001,null)
  }
}

module.exports = DuplicatedException
