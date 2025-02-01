'use strict'
const BlackListException = use('App/Exceptions/BlackListException')

class BlackList {
  async handle({request, auth}, next) {
    let user = await auth.user
    if(!user.status){
      throw new BlackListException()
    }
    await next()
  }
}

module.exports = BlackList
