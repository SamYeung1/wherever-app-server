'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')

class TraceComment {
  get rules() {
    return {
      trace_id: 'required',
      message: 'required'
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

module.exports = TraceComment
