'use strict'
const MissingParameterException = use('App/Exceptions/MissingParameterException')

class FriendRequest {
  get rules() {
    return {
      user_id: 'required'
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

module.exports = FriendRequest
