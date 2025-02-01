'use strict'

const MissingParameterException = use('App/Exceptions/MissingParameterException')

class Request {
  get rules() {
    return {
      request_id: 'required'
    }
  }

  get messages() {
    return {
      'required': '{{ field }} is required'
    }
  }

  async fails(error) {
    throw new MissingParameterException()
  }
}

module.exports = Request
