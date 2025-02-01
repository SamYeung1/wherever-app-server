'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

class SystemException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle(error, request, response) {
    console.log(error)
    return response.outputWithCode(9000,null,error.toString())
  }
}

module.exports = SystemException
