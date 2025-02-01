'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')
const Antl = use('Antl')

class AuthException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    return response.outputWithCode(4001,null,Antl.forLocale(request.getLang()).formatMessage('api_messages.password_invalid'))
  }
}

module.exports = AuthException
