'use strict'
const BaseExceptionHandler = use('BaseExceptionHandler')
const AuthExpiredException = use('App/Exceptions/AuthExpiredException')
const SystemException = use('App/Exceptions/SystemException')
const UnsupportedMediaTypeErrorException = use('App/Exceptions/UnsupportedMediaTypeErrorException')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, {request, response}) {
    console.log(error)
    switch (error.name) {
      case 'InvalidJwtToken':
        return response.rejectAuth()
      case 'ExpiredJwtToken':
        return await new AuthExpiredException().handle(error, request, response)
      case 'UnsupportedMediaTypeError':
        return await new UnsupportedMediaTypeErrorException().handle(error, request, response)
      default:
        return error.handle ? error.handle(error, request, response) : await new SystemException().handle(error, request, response)
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, {request}) {
  }
}

module.exports = ExceptionHandler
