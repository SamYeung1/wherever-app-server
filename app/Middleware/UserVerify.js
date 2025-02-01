'use strict'
const UserVerifyException = use('App/Exceptions/UserVerifyException')

class UserVerify {
  async handle({request, auth}, next) {
    let user = await auth.user
    if(!user.is_verify){
      throw new UserVerifyException()
    }
    await next()
  }
}

module.exports = UserVerify
