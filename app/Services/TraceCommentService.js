const path = require('path')
const QueryBuilder = require(path.join(__dirname, '../../util/queryBuilder'))
const Comment = use('App/Models/TraceComment')

class TraceCommentService {
  static async getCommentById(id) {
    const comment = await Comment.query().with('user').where('_id', id).where('is_deleted', false).where('status', true).first()
    return comment
  }

  static async getComments(paginator, queryBuilder = null, sortBy = {'updated_at': -1}) {
    const result = await Comment.query()
      .where(function () {
        this.where('is_deleted', false)
        this.where('status',true)
        if (queryBuilder) {
          queryBuilder.queryHelper().forEach((query) => {
            this.where(query.field, query.operator, query.value)
          })
        }
      })
      .with('user')
      .with('trace')
      .sort(sortBy).paginate(paginator.page, paginator.limit)
    return result
  }

  static async insertMessageComment({user, trace, message}) {
    let comment = await Comment.create({
      user_id: user._id,
      trace_id: trace._id,
      message: message,
      type: 'MESSAGE',
      is_edited: false
    })
    return comment
  }

  static async getCommentsByTraceId(paginator, traceId, sortBy = {'updated_at': -1}) {
    const queryBuilder = new QueryBuilder()
    queryBuilder.addQuery(new QueryBuilder.Query('trace_id', '=', traceId))
    const result = TraceCommentService.getComments(paginator, queryBuilder, sortBy)
    return result
  }

  static async getCommentSizeByTraceId(traceId) {
    const result = await Comment.query().where('trace_id', traceId).where('is_deleted', false).where('status', true).count()
    return result ? result : 0
  }

  static async updateComment(id, {message}) {
    const result = await Comment.find(id)
    if (message) {
      result.message = message
      result.is_edited = true
    }
    return await result.save()
  }

  static async deleteCommentById(id) {
    let comment = await Comment.find(id)
    if (comment) {
      comment.is_deleted = true
      await comment.save()
    }
    return comment
  }

  static async createAPIModel(comment,authUser) {
    return await Comment.createAPIModel(comment.toJSON ? comment.toJSON() : comment,authUser)
  }
}

module.exports = TraceCommentService
