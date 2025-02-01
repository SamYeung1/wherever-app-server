'use strict'
const FriendService = use('App/Services/FriendService')
const UserService = use('App/Services/UserService')
const PermissionException = use('App/Exceptions/PermissionException')

class OnlyFriend {
  async handle({params:{user_id},request, auth}, next) {
    let user = await auth.user
    let userId = user_id !== 'me' ? user_id : user._id.toString()
    let relatedUser = await UserService.getUserById(userId)
    if(user._id.toString() === relatedUser._id.toString()){
      return await next()
    }
    if (!await FriendService.isExist(user._id, relatedUser._id)) {
      throw new PermissionException()
    }
    await next()
  }
}

module.exports = OnlyFriend
