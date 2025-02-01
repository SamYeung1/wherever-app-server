'use strict'
const _ = require('lodash')
const path = require('path')
const Paginator = require(path.join(__dirname, '../../../../util/paginator'))
const TraceService = use('App/Services/TraceService')
const ReactionHistoryService = use('App/Services/TraceReactionHistoryService')
const NotFoundException = use('App/Exceptions/NotFoundException')
const InboxHelper = use('App/Helpers/InboxHelper')
const AuthException = use('App/Exceptions/AuthException')

class TraceReactionHistoryController {
  async index({request, response, auth}) {
    let requestBody = request.only(['trace_id', 'p', 'limit'])
    let trace = await TraceService.getTraceById(requestBody.trace_id)
    if (!trace) {
      throw new NotFoundException()
    }
    let reactions = await ReactionHistoryService.getReactionHistoryByTraceIdWithLove(Paginator.parsePaginate(request), trace._id)
    let reactionsJson = (await reactions).toJSON()
    let data = await Promise.all(reactionsJson.data.map(async (reaction)=>await ReactionHistoryService.createAPIModel(reaction)))
    return response.outputWithPaging(data,reactionsJson.total,reactionsJson.lastPage)
  }

  async store({request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['trace_id'])
    let trace = await TraceService.getTraceById(requestBody.trace_id)
    if (!trace) {
      throw new NotFoundException()
    }
    let isReactionExist = await ReactionHistoryService.isReactionExist(user._id, trace._id)
    let reactionHistory = null
    if (isReactionExist) {
      reactionHistory = await ReactionHistoryService.restoreReactionHistoryByTraceIdAndUserId(trace._id, user._id)
    } else {
      reactionHistory = await ReactionHistoryService.insertReactionHistory(user._id, trace._id)
    }
    if (reactionHistory) {
      await InboxHelper.sendReactionInbox(user, trace, reactionHistory)
    }
    return response.output(null)
  }

  async destroy({request, response,auth}) {
    let user = await auth.user
    let requestBody = request.only(['trace_id'])
    let trace = await TraceService.getTraceById(requestBody.trace_id)
    if (!trace) {
      throw new NotFoundException()
    }
    await ReactionHistoryService.deleteReactionHistoryByTraceIdAndUserId(trace._id, user._id)
    return response.output(null)
  }
}

module.exports = TraceReactionHistoryController
