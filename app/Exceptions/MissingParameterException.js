'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class MissingParameterException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(9001,null)
  }
}

module.exports = MissingParameterException
