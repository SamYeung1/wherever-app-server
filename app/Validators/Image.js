'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')
const { formatters } = use('Validator')
class Image {
  get rules() {
    return {
      src: 'file|file_ext:png,jpg|file_types:image|required',
      token_date:'number|required'
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

module.exports = Image
