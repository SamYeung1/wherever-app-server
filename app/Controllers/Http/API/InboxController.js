'use strict'
const _ = require('lodash')
const path = require('path')
const Paginator = require(path.join(__dirname, '../../../../util/paginator'))
const UserInboxService = use('App/Services/UserInboxService')
const NotFoundException = use('App/Exceptions/NotFoundException')
const AuthException = use('App/Exceptions/AuthException')

class InboxController {
  /**
   * Show a list of all.
   * GET
   */
  async index({request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['p', 'limit', 'sort_by'])
    let inboxes = await UserInboxService.getInboxBySendToUserId(user._id, Paginator.parsePaginate(request), requestBody.sort_by)
    let inboxesJson = (await inboxes).toJSON()
    let packedObjects = Promise.all(inboxesJson.data.map(
      async (obj) => {
        return await UserInboxService.createAPIModel(obj, request.getLang())
      }))
    return response.outputWithPaging(await packedObjects,inboxesJson.total,inboxesJson.lastPage)
  }

  /**
   * Display.
   * GET
   */
  async show({params, request, response, auth}) {
    let user = await auth.user
    let userInbox = await UserInboxService.getUserInboxById(params.id)
    if (!userInbox) {
      throw new NotFoundException()
    }
    if (userInbox.toObject().send_to_user_id.toString() != user._id.toString()) {
      throw new AuthException()
    }
    return response.output(await UserInboxService.createAPIModel(userInbox,request.getLang()))
  }

  /**
   * Update.
   * PUT or PATCH
   */
  async update({params, request, response, auth}) {
    let user = await auth.user
    let userInbox = await UserInboxService.getUserInboxById(params.id)
    if (!userInbox) {
      throw new NotFoundException()
    }
    if (userInbox.toObject().send_to_user_id.toString() != user._id.toString()) {
      throw new AuthException()
    }
    await UserInboxService.updateIsReadUserInboxById(userInbox._id)
    return response.output(null)
  }
  async updateAll({response, auth}) {
    let user = await auth.user
    await UserInboxService.updateIsReadUserInboxBySendToUserId(user._id)
    return response.output(null)
  }

  /**
   * Delete.
   * DELETE contacts/:id
   */
  async destroy({params, request, response}) {
    return response.output(params.id)
  }

}

module.exports = InboxController
