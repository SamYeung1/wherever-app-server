'use strict'
const path = require('path')
const moment = require('moment')
const ObjectId = require('bson-objectid')
const TraceService = use('App/Services/TraceService')
const TagService = use('App/Services/TagService')
const CommentService = use('App/Services/TraceCommentService')
const ReactionHistoryService = use('App/Services/TraceReactionHistoryService')
const UserFavouriteService = use('App/Services/UserFavouriteService')
const NotFoundException = use('App/Exceptions/NotFoundException')
const MissingParameterException = use('App/Exceptions/MissingParameterException')
const _ = require('lodash')

class ImageTraceController {

  /**
   * Show a list of all.
   * GET
   */
  async index({request, response, auth}) {
    let user = await auth.user
    let {longitude, latitude, distance, start_date, end_date, user_ids, tags} = request.all()
    let traces = await TraceService.getTraceWithGeoAndDateRangeAndUserId(longitude, latitude, distance, start_date, end_date)
    if (user_ids) {
      traces = await TraceService.getTraceWithGeoAndDateRangeAndUserId(longitude, latitude, distance, start_date, end_date, user_ids.split(',').map((user) => {
        return new ObjectId(user)
      }))
    }

    let data = []
    traces = tags ? _.filter(traces, (trace) => _.some(trace.tags.map((tag) => _.some(tags.split(','), _.matches(tag)), true))) : traces
    for (let trace of traces) {
      let original = await TraceService.createAPIModel(trace)
      original['distance'] = trace['distance']
      original['post_date'] = new Date(trace['updated_at']).getTime()
      original['token_date'] = new Date(trace['token_date']).getTime()
      original['comment_total'] = await CommentService.getCommentSizeByTraceId(trace['_id'])
      original['reaction_total'] = await ReactionHistoryService.getReactionHistorySizeByTraceId(trace['_id'])
      original['is_reacted'] = await ReactionHistoryService.isReactionExist(user._id, trace['_id'], false)
      original['is_favourite'] = await UserFavouriteService.isTraceExist(user._id, trace['_id'])
      data.push(original)
    }
    return response.output(data)
  }

  /**
   * Create/save.
   * POST
   */
  async store({request, response, auth}) {
    let user = await auth.user
    let body = {}
    let passModel = null
    request.multipart.field((name, value) => {
      body[name] = value
    })
    request.multipart.file('src', {}, async (file) => {
      let [original, mobile, thumbnail] = await TraceService.uploadImage(user._id, file)
      passModel = {user: user, ...body}
      passModel['infos'] = [{
        type: 'DESCRIPTION',
        value: body['description'],
        valueType: 'STRING'
      }]
      passModel['token_date'] = body.token_date ? moment.unix(body.token_date / 1000).toDate() : moment().toDate()
      passModel['tags'] = body.tags ? body.tags.split(',') : []
      passModel['banners'] = [
        {
          path: original,
          type: 'IMAGE'
        },
        {
          path: mobile,
          type: 'IMAGE_MOBILE'
        },
        {
          path: thumbnail,
          type: 'IMAGE_THUMBNAIL'
        }
      ]
    })
    await request.multipart.process()
    let trace = null
    if (passModel) {
      trace = await TraceService.insertTrace(passModel)
      trace = await TraceService.getTraceById(trace._id)
      for (let tag of passModel['tags']) {
        await TagService.insertAndCountTag(tag)
      }
    }
    return response.output(await TraceService.createAPIModel(trace))
  }

  /**
   * Display.
   * GET
   */
  async show({params, request, response, auth}) {
    let user = await auth.user
    let trace = await TraceService.getTraceById(params.id)
    if (!trace) {
      throw new NotFoundException()
    }
    let apiModel = await TraceService.createAPIModel(trace)
    apiModel['comment_total'] = await CommentService.getCommentSizeByTraceId(params.id)
    apiModel['reaction_total'] = await ReactionHistoryService.getReactionHistorySizeByTraceIdWithLove(params.id)
    apiModel['is_reacted'] = await ReactionHistoryService.isReactionExist(user._id, params.id, false)
    apiModel['is_favourite'] = await UserFavouriteService.isTraceExist(user._id, trace._id)
    apiModel['is_me'] = trace.user_id.toString() === user._id.toString()
    return response.output(apiModel)
  }

  /**
   * Update.
   * PUT or PATCH
   */
  async update({params, request, response}) {
    let trace = await TraceService.getTraceById(params.id)
    if (!trace) {
      throw new NotFoundException()
    }
    let body = request.only(['title', 'description', 'longitude', 'latitude', 'tags'])
    await TraceService.updateTrace(trace, body)
    trace = await TraceService.getTraceById(params.id)
    let tags = body.tags ? body.tags : []
    for (let tag of tags) {
      await TagService.insertAndCountTag(tag)
    }
    return response.output( await TraceService.createAPIModel(trace))
  }

  /**
   * Delete.
   * DELETE contacts/:id
   */
  async destroy({params, request, response}) {
    let trace = await TraceService.getTraceById(params.id)
    if (!trace) {
      throw new NotFoundException()
    }
    await TraceService.deleteTraceById(params.id)
    await Promise.all(trace.banners.map(async (banner) => {
      return TraceService.deleteImage(trace._id, banner.path)
    }))
    return response.output(await TraceService.createAPIModel(trace))
  }

}

module.exports = ImageTraceController
