const ObjectID = require('lucid-mongo')
const Trace = use('App/Models/Trace')
const Database = use('Database')
const path = require('path')
const moment = require('moment')
const QueryBuilder = require(path.join(__dirname, '../../util/queryBuilder'))
const UploaderService = use('App/Services/UploaderService')

class TraceService {
  static async getTraceByUserId(paginator, UserId, sortBy = {'updated_at': -1}){
    const queryBuilder = new QueryBuilder()
    queryBuilder.addQuery(new QueryBuilder.Query('user_id', '=', UserId))
    const result = TraceService.getTraces(paginator, queryBuilder, sortBy)
    return result
  }

  static async getTraces(paginator, queryBuilder = null, sortBy = {'updated_at': -1}) {
    const result = await Trace.query()
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
      .sort(sortBy).paginate(paginator.page, paginator.limit)
    return result
  }


  static async getTraceById(id) {
    const trace = await Trace.query().with('user').where('_id', id).where('is_deleted', false).where('status', true).first()
    return trace
  }

  static async getTraceWithGeoAndDateRangeAndUserId(longitude, latitude, distance, startDate, endDate, userIds = null) {
    const query = {
      token_date: {
        '$gte': moment(startDate).hour(0).minute(0).second(0).toDate(),
        '$lte': moment(endDate).hour(23).minute(59).second(59).toDate()
      }
    }
    if (userIds) {
      query['user_id'] = {'$in': userIds}
    }
    query['is_deleted'] = false;
    query['status'] = true
    const trace = await Trace.query().aggregate([
      {
        $geoNear: {
          near: {type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)]},
          query: query,
          key: "_geo",
          distanceField: "distance",
          spherical: true,
          maxDistance: parseInt(distance)
        }
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'user'
        }
      },
      {$unwind: '$user'}
    ])
    return trace
  }

  static async insertTrace({user, banners, title, longitude, latitude, description, tags,token_date}) {
    let trace = await Trace.create({
      user_id: user._id,
      banners: banners,
      title: title,
      longitude: Number(longitude),
      latitude: Number(latitude),
      _geo: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      description: description,
      tags: tags,
      token_date:token_date
    })
    return trace
  }

  static async uploadImage(id, file) {
    const time = Date.now().toString()
    return Promise.all([
      UploaderService.uploadImage(file, `collection/${id}/`, `image_${time}`, 2000),
      UploaderService.uploadImage(file, `collection/${id}/`, `image_${time}_mobile`, 500),
      UploaderService.uploadImage(file, `collection/${id}/`, `image_${time}_thumbnail`, 200)
    ])
  }

  static async deleteImage(id, path) {
    return await UploaderService.deleteImage(`${path}`)
  }

  static async updateTrace(trace, {title, longitude, latitude, description, tags}) {
    if (title)
      trace.title = title
    if (longitude) {
      trace.longitude = Number(longitude)
      trace._geo.longitude = Number(longitude)
    }
    if (latitude) {
      trace.latitude = Number(latitude)
      trace._geo.latitude = Number(latitude)
    }
    if (description) {
      trace.description = description
    }
    if (tags)
      trace.tags = tags
    return await trace.save()
  }

  static async deleteTraceById(id) {
    let trace = await Trace.find(id)
    if (trace) {
      trace.is_deleted = true
      await trace.save()
    }
    return trace
  }

  static async createAPIModel(trace) {
    return await Trace.createAPIModel(trace.toJSON ? trace.toJSON() : trace)
  }
}

module.exports = TraceService
