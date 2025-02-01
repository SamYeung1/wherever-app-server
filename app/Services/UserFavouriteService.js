const path = require('path')
const UserFavourite = use('App/Models/UserFavourite')
const QueryBuilder = require(path.join(__dirname, '../../util/queryBuilder'))

class UserFavouriteService {


  static async getUserFavourites(paginator, queryBuilder = null, sortBy = {'updated_at': -1}) {
    const result = await UserFavourite.query()
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

  static async getUserFavouritesByUserId(paginator, userId, sortBy = {'updated_at': -1}) {
    const queryBuilder = new QueryBuilder()
    queryBuilder.addQuery(new QueryBuilder.Query('user_id', '=', userId))
    const result = UserFavouriteService.getUserFavourites(paginator, queryBuilder, sortBy)
    return result
  }


  static async insertUserFavourite(userId, traceId) {
    let result = await UserFavourite.create({
      user_id: userId,
      trace_id: traceId
    })
    return result
  }


  static async deleteRequestByTraceId(userId, traceId) {
    const result = UserFavourite.query().where('user_id', userId).where('trace_id', traceId).where('is_deleted', false)
    return await result.delete()
  }

  static async isTraceExist(userId, traceId) {
    const result = await UserFavourite.query().where('user_id', userId).where('trace_id', traceId).where('is_deleted', false).where('status', true).first()
    return result != null
  }


  static async createAPIModel(userFavourite) {
    return await UserFavourite.createAPIModel(userFavourite.toJSON ? userFavourite.toJSON() : userFavourite)
  }
}

module.exports = UserFavouriteService
