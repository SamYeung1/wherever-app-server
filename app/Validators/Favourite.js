'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')

class Favourite {
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
    throw new MissingParameterException()
  }
}

module.exports = Favourite
