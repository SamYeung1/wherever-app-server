'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class UnsupportedMediaTypeErrorException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(8001,null)
  }
}

module.exports = UnsupportedMediaTypeErrorException
