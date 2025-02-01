'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')
const PasswordFormatException = use('App/Exceptions/PasswordFormatException')
class ChangePassword {
  get rules() {
    return {
      new_password: 'required|min:8',
      current_password: 'required'
    }
  }

  get messages() {
    return {
      'required': '{{ field }} is required',
      'new_password.min': 'Password is too short',
    }
  }

  async fails(error) {
    let passwordmin = error.find((e) => e.field === 'new_password' && e.validation === 'min')
    if (passwordmin) {
      throw new PasswordFormatException()
    }
    throw new MissingParameterException()
  }
}

module.exports = ChangePassword
