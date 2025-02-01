'use strict'
const path = require('path')
const Paginator = require(path.join(__dirname, '../../../../util/paginator'))
const UserFavouriteService = use('App/Services/UserFavouriteService')
const TraceService = use('App/Services/TraceService')
const NotFoundException = use('App/Exceptions/NotFoundException')

class UserFavouriteController {
  /**
   * Show a list of all.
   * GET
   */
  async index({request, response, auth}) {
    let user = await auth.user
    let items = await UserFavouriteService.getUserFavouritesByUserId(Paginator.parsePaginate(request), user._id)
    let itemsJson = (await items).toJSON()
    let data = await Promise.all(itemsJson.data.map( async (item) => await UserFavouriteService.createAPIModel(item)))
    return response.outputWithPaging(data, itemsJson.total, itemsJson.lastPage)
  }

  /**
   * Update.
   * PUT or PATCH
   */
  async update({params, request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['trace_id'])
    let trace = await TraceService.getTraceById(requestBody.trace_id)
    if (!trace) {
      throw new NotFoundException()
    }
    let isExist = await UserFavouriteService.isTraceExist(user._id, trace._id)
    if (!isExist) {
      await UserFavouriteService.insertUserFavourite(user._id, trace._id)
    }
    return response.output(await TraceService.createAPIModel(trace))
  }

  /**
   * Delete.
   * DELETE contacts/:id
   */
  async destroy({params, request, response,auth}) {
    let user = await auth.user
    let requestBody = request.only(['trace_id'])
    let trace = await TraceService.getTraceById(requestBody.trace_id)
    if (!trace) {
      throw new NotFoundException()
    }
    let isExist = await UserFavouriteService.isTraceExist(user._id, trace._id)
    if (!isExist) {
        throw new NotFoundException()
    }
    await UserFavouriteService.deleteRequestByTraceId(user._id, trace._id)
    return response.output(await TraceService.createAPIModel(trace))
  }
}

module.exports = UserFavouriteController
