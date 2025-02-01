'use strict'
const DuplicatedException = use('App/Exceptions/DuplicatedException')
const MissingParameterException = use('App/Exceptions/MissingParameterException')
const PasswordFormatException = use('App/Exceptions/PasswordFormatException')
const {rule} = use('Validator')

class UserProfile {
  get rules() {
    return {
      email: 'required|email|unique:users',
      password: 'required|min:8',
      display_name: 'required'
    }
  }

  get messages() {
    return {
      'required': '{{ field }} is required',
      'gender.regex': '{{ field }} is M or F',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password',
      'password.min': 'Password is too short',
    }
  }

  async fails(error) {
    let emailDuplicated = error.find((e) => e.field === 'email' && e.validation === 'unique')
    if (emailDuplicated) {
      throw new DuplicatedException()
    }
    let passwordmin = error.find((e) => e.field === 'password' && e.validation === 'min')
    if (passwordmin) {
      throw new PasswordFormatException()
    }
    throw new MissingParameterException()
  }
}

module.exports = UserProfile
