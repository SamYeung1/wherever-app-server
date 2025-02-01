'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(9003,null)
  }
}

module.exports = NotFoundException
