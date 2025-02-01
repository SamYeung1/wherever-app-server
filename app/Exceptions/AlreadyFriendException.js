'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class AlreadyFriendException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(9004,null)
  }
}

module.exports = AlreadyFriendException
