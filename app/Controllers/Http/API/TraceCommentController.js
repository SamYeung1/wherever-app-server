'use strict'
const path = require('path')
const TraceService = use('App/Services/TraceService')
const CommentService = use('App/Services/TraceCommentService')
const InboxHelper = use('App/Helpers/InboxHelper')
const Paginator = require(path.join(__dirname, '../../../../util/paginator'))
const NotFoundException = use('App/Exceptions/NotFoundException')
const AuthException = use('App/Exceptions/AuthException')

class TraceCommentController {
  /**
   * Show a list of all.
   * GET
   */
  async index({request, response, auth}) {
    let user = await auth.user
    let requestBody = request.only(['trace_id', 'p', 'limit'])
    let trace = await TraceService.getTraceById(requestBody.trace_id)
    if (!trace) {
      throw new NotFoundException()
    }

    let comments = await CommentService.getCommentsByTraceId(Paginator.parsePaginate(request), requestBody.trace_id)
    let commentsJson = (await comments).toJSON()
    let data = commentsJson.data.map(async (comment) =>await CommentService.createAPIModel(comment,user))
    return response.outputWithPaging(data, commentsJson.total,commentsJson.lastPage)
  }

  /**
   * Create/save.
   * POST
   */
  async store({request, response, auth}) {
    let requestBody = request.only(['trace_id', 'message'])
    let user = await auth.user
    let trace = await TraceService.getTraceById(requestBody.trace_id)
    if (!trace) {
      throw new NotFoundException()
    }
    let comment = await CommentService.insertMessageComment({
      user: user,
      trace: trace,
      message: requestBody.message
    })
    await InboxHelper.sendCommentInbox(user, trace, comment)
    return response.output( await CommentService.createAPIModel(await CommentService.getCommentById(comment._id),user))
  }

  /**
   * Display.
   * GET
   */
  async show({params, request, response, auth}) {
    let user = await auth.user
    let comment = await CommentService.getCommentById(params.id)
    if (!comment) {
      throw new NotFoundException()
    }
    return response.output(await CommentService.createAPIModel(comment,user))
  }

  /**
   * Update.
   * PUT or PATCH
   */
  async update({params, request, response, auth}) {
    let requestBody = request.only(['message'])
    let user = await auth.user
    let comment = await CommentService.getCommentById(params.id)
    if (!comment) {
      throw new NotFoundException()
    }
    if (comment.toObject().user_id.toString() != user.toObject()._id.toString()) {
      throw new AuthException()
    }
    let updatedComment = await CommentService.updateComment(comment._id, {message: requestBody.message})
    if(!updatedComment){
      throw new NotFoundException()
    }
    comment = await CommentService.getCommentById(params.id)
    return response.output(await CommentService.createAPIModel(comment,user))
  }

  /**
   * Delete.
   * DELETE contacts/:id
   */
  async destroy({params, request, response, auth}) {
    let user = await auth.user
    let comment = await CommentService.getCommentById(params.id)
    if (!comment) {
      throw new NotFoundException()
    }
    if (comment.toObject().user_id.toString() != user.toObject()._id.toString()) {
      throw new AuthException()
    }
    await CommentService.deleteCommentById(comment._id)
    return response.output(await CommentService.createAPIModel(comment,user))
  }
}

module.exports = TraceCommentController
