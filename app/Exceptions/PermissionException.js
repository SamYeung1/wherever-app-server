'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class PermissionException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(4003,null)
  }
}

module.exports = PermissionException
