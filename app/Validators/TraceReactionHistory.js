'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')

class TraceReactionHistory {
  get rules() {
    return {
      trace_id: 'required'
    }
  }

  get messages() {
    return {
      'required': '{{ field }} is required'
    }
  }
  async fails(error) {
    console.log(error)
    throw new MissingParameterException()
  }
}

module.exports = TraceReactionHistory
