'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')
const { formatters } = use('Validator')
class Report {
  get rules() {
    return {
      message: 'required',
      type:'required',
      source_id:'required'
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

module.exports = Report
