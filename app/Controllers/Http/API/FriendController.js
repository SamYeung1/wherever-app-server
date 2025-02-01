'use strict'
const path = require('path')
const Paginator = require(path.join(__dirname, '../../../../util/paginator'))
const FriendService = use('App/Services/FriendService')
const UserService = use('App/Services/UserService')
const ProfileService = use('App/Services/ProfileService')
const NotFoundException = use('App/Exceptions/NotFoundException')

class FriendController {
  /**
   * Show a list of all.
   * GET
   */
  async index({request, response, auth}) {
    let user = await auth.user
    let friends = await FriendService.getFriendsUserId(user._id, Paginator.parsePaginate(request), null)
    let friendsJson = (await friends).toJSON()
    let data = await Promise.all(friendsJson.data.map(async (friend) => await FriendService.createAPIModel(friend)))
    return response.outputWithPaging(data,friendsJson.total)
  }

  async destroy({params, request, response, auth}) {
    let user = await auth.user
    let relatedUser = await UserService.getUserById(params.id)
    if (!relatedUser) {
      throw new NotFoundException()
    }
    if (!await FriendService.isExist(user._id, relatedUser._id)) {
      throw new NotFoundException()
    }
    await FriendService.deleteFriend(user._id, relatedUser._id)
    return response.output(null)
  }
}

module.exports = FriendController
