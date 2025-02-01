'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class MissingHeaderException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(9002,null)
  }
}

module.exports = MissingHeaderException
