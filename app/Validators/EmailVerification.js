'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')
const { formatters } = use('Validator')
class Version {
  get rules() {
    return {
      code:'required'
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

module.exports = Version
