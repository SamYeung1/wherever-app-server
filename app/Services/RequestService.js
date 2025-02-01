const path = require('path')
const Request = use('App/Models/Request')
const QueryBuilder = require(path.join(__dirname, '../../util/queryBuilder'))

class RequestService {
  static async getRequestById(id) {
    const request = await Request.query().with('user').where('_id', id).where('is_deleted', false).where('status', true).first()
    return request
  }

  static async getRequestByUserIdAndSourceIdAndType(user_id, source_id, type) {
    const request = await Request.query().with('user').where('user_id', user_id).where('source_id', source_id).where('type', type).where('status', true).where('is_deleted', false).first()
    return request
  }

  static async getRequests(paginator, queryBuilder = null, sortBy = {'updated_at': -1}) {
    const result = await Request.query()
      .where(function () {
        this.where('is_deleted', false)
        if (queryBuilder) {
          queryBuilder.queryHelper().forEach((query) => {
            this.where(query.field, query.operator, query.value)
          })
        }
      })
      .with('user')
      .with('source')
      .sort(sortBy).paginate(paginator.page, paginator.limit)
    return result
  }

  static async getFriendRequestsBySourceId(paginator, sourceId, sortBy = {'updated_at': -1}) {
    const queryBuilder = new QueryBuilder()
    queryBuilder.addQuery(new QueryBuilder.Query('source_id', '=', sourceId))
    queryBuilder.addQuery(new QueryBuilder.Query('type', '=', 'FRIEND'))
    const result = RequestService.getRequests(paginator, queryBuilder, sortBy)
    return result
  }


  static async insertFriendRequest(user_id, source_id) {
    let request = await Request.create({
      user_id: user_id,
      source_id: source_id,
      type: 'FRIEND'
    })
    return request
  }

  static async insertGroupRequest(user_id, source_id) {
    let request = await Request.create({
      user_id: user_id,
      source_id: source_id,
      type: 'GROUP'
    })
    return request
  }

  static async deleteRequestById(id) {
    let request = await Request.find(id)
    return await request.delete()
  }

  static async isSourceExist(user_id, source_id, type) { //Tom want to cancel or Send Request to Sam
    //user_id = Tom //Sender
    //source_id = Sam //Source
    const result = await Request.query().where('user_id', user_id).where('source_id', source_id).where('type', type).where('is_deleted', false).first()
    return result != null
  }

  static async isSenderExist(user_id, source_id, type) { //Sam want to accept Tom's Request from Tom Page
    //source_id = Sam //Me
    //user_id = Tom // Sender
    const result = await Request.query().where('user_id', source_id).where('source_id', user_id).where('type', type).where('is_deleted', false).first()
    return result != null
  }

  static async getNumberOfRequestBySourceId(source_id){
    const result = Request.query().where('source_id', source_id).where('status', true).where('is_deleted', false)
    return (await result.count()) ? await result.count() : 0
  }

  static async createAPIModel(request) {
    return await Request.createAPIModel(request.toJSON ? request.toJSON() : request)
  }
}

module.exports = RequestService
