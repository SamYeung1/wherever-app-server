'use strict'
const path = require('path')
const Paginator = require(path.join(__dirname, '../../../../util/paginator'))
const RequestService = use('App/Services/RequestService')
const FriendService = use('App/Services/FriendService')
const ProfileService = use('App/Services/ProfileService')
const UserInboxService = use('App/Services/UserInboxService')
const NotFoundException = use('App/Exceptions/NotFoundException')
const AlreadyFriendException = use('App/Exceptions/AlreadyFriendException')
const MissingParameterException = use('App/Exceptions/MissingParameterException')

class RequestController {
  async sendFriendRequest({request, response, auth}) {
    let requestBody = request.only(['user_id'])
    let user = await auth.user
    let source = await ProfileService.getProfileById(requestBody.user_id)
    if (!source) {
      throw new NotFoundException()
    }
    if (await FriendService.isExist(user._id, source.user_id)) {
      throw new AlreadyFriendException()
    }
    if ((!(await RequestService.isSourceExist(user._id, source.user_id, 'FRIEND')) &&
      !(await RequestService.isSenderExist(user._id, source.user_id, 'FRIEND'))) &&
      user._id.toString() !== requestBody.user_id) {
      await RequestService.insertFriendRequest(user._id, source.user_id)
    }
    return response.output(null)
  }

  async cancelFriendRequest({request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['user_id'])
    let requestResult = await RequestService.getRequestByUserIdAndSourceIdAndType(user._id, requestBody.user_id, 'FRIEND')
    if (!requestResult) {
      throw new NotFoundException()
    }
    await RequestService.deleteRequestById(requestResult._id)
    return response.output(null)
  }

  async index({request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['p', 'limit', 'sort_by'])
    let requests = await RequestService.getFriendRequestsBySourceId(Paginator.parsePaginate(request), user._id, requestBody.sort_by)

    let requestJson = (await requests).toJSON()
    let data = await Promise.all(requestJson.data.map(async (request) => await RequestService.createAPIModel(request)));
    return response.outputWithPaging(data,requestJson.total)
  }

  async acceptFriendRequest({request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['request_id', 'user_id'])
    let requestResult = null
    if (requestBody.request_id) {
      requestResult = await RequestService.getRequestById(requestBody.request_id)
    } else if (requestBody.user_id) {
      requestResult = await RequestService.getRequestByUserIdAndSourceIdAndType(requestBody.user_id, user._id, 'FRIEND')
      console.log(requestResult, user._id, requestBody.user_id)
    } else {
      throw new MissingParameterException()
    }
    if (!requestResult) {
      throw new NotFoundException()
    }
    if (requestResult.source_id.toString() !== user._id.toString()) {
      throw new NotFoundException()
    }
    await FriendService.createFriend(user._id, requestResult.user_id)
    await RequestService.deleteRequestById(requestResult._id)
    await UserInboxService.insertFriendAcceptInbox(user._id, requestResult.user_id)
    return response.output(null)
  }

  async denyFriendRequest({request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['request_id'])
    let requestResult = await RequestService.getRequestById(requestBody.request_id)
    if (!requestResult) {
      throw new NotFoundException()
    }
    if (requestResult.source_id.toString() !== user._id.toString()) {
      throw new NotFoundException()
    }
    await RequestService.deleteRequestById(requestResult._id)
    return response.output(null)
  }
}

//delete friend (user_id = auth.user AND related_user_id = request.user_id) OR (related_user_id = auth.user AND user_id = request.user_id)

module.exports = RequestController
