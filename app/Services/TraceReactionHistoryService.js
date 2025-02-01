const path = require('path')
const QueryBuilder = require(path.join(__dirname, '../../util/queryBuilder'))
const ReactionHistory = use('App/Models/TraceReactionHistory')
class TraceReactionHistoryService {
  static async getReactionHistories(paginator, queryBuilder = null, sortBy = {'updated_at': -1}) {
    const result = await ReactionHistory.query()
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

  static async insertReactionHistory(user_id, trace_id, type = 'LOVE') {
    let reactionHistory = await ReactionHistory.create({
      user_id: user_id,
      trace_id: trace_id,
      type: type
    })
    return reactionHistory
  }

  static async getReactionHistoryByTraceIdWithLove(paginator, traceId, sortBy = {'updated_at': -1}) {
    const queryBuilder = new QueryBuilder()
    queryBuilder.addQuery(new QueryBuilder.Query('trace_id', '=', traceId))
    queryBuilder.addQuery(new QueryBuilder.Query('type', '=', 'LOVE'))
    const result = await TraceReactionHistoryService.getReactionHistories(paginator, queryBuilder, sortBy)
    return result
  }

  static async isReactionExist(user_id, trace_id,is_deleted = null) {
    let result = ReactionHistory.query().where('user_id', user_id).where('trace_id', trace_id)
    if(is_deleted !=null){
      result = result.where('is_deleted', is_deleted).where('status', true)
    }
    return (await result.count()) > 0;
  }

  static async getReactionHistorySizeByTraceIdWithLove(traceId) {
    const result = await ReactionHistory.query().where('trace_id', traceId).where('type', 'LOVE').where('is_deleted', false).where('status', true).count()
    return result ? result : 0
  }
  static async getReactionHistorySizeByTraceId(traceId) {
    const result = await ReactionHistory.query().where('trace_id', traceId).where('is_deleted', false).where('status', true).count()
    return result ? result : 0
  }

  static async deleteReactionHistoryByTraceIdAndUserId(trace_id, user_id) {
    let reactionHistory = await ReactionHistory.query().where('trace_id', trace_id).where('user_id', user_id).update({is_deleted: true})
    return reactionHistory
  }

  static async restoreReactionHistoryByTraceIdAndUserId(trace_id, user_id) {
    let reactionHistory = await ReactionHistory.query().where('trace_id', trace_id).where('user_id', user_id).first()
    if (reactionHistory) {
      reactionHistory.is_deleted = false
      await reactionHistory.save()
    }
    return reactionHistory
  }
  static async createAPIModel(reactionHistory) {
    return await ReactionHistory.createAPIModel(reactionHistory.toJSON ? reactionHistory.toJSON() : reactionHistory)
  }
}

module.exports = TraceReactionHistoryService
