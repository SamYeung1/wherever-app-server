'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')

class Geo {
  get rules() {
    return {
      longitude: 'number|required',
      latitude: 'number|required',
      distance:'number|required',
      start_date:'date|required',
      end_date:'date|required'
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

module.exports = Geo
