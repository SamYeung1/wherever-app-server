'use strict'

const path = require('path')
const BaseModel = require(path.join(__dirname, './Base/BaseModel'))
const UserProfile = use('App/Models/Profile')
const Trace = use('App/Models/Trace')
const Comment = use('App/Models/TraceComment')

class UserInbox extends BaseModel {
  static get objectIDs() {
    return ['_id', 'user_id', 'trace_id', 'comment_id', 'send_to_user_id']
  }

  inbox() {
    return this.hasOne('App/Models/Inbox', 'inbox_key', 'key').with(['link']).where('is_deleted', false)
  }

  user() {
    return this.belongsTo('App/Models/Profile', 'user_id', 'user_id').where('is_deleted', false)
  }

  sendToUser() {
    return this.belongsTo('App/Models/Profile', 'send_to_user_id', 'user_id').where('is_deleted', false)
  }

  trace() {
    return this.hasOne('App/Models/Trace', 'trace_id', '_id').with('user').where('is_deleted', false)
  }

  comment() {
    return this.hasOne('App/Models/TraceComment', 'comment_id', '_id').with('user').where('is_deleted', false)
  }

  static async createAPIModel(data, lang) {
    let model = {}
    let linkParams = data['inbox']['link']['params']
    let params = linkParams.map((linkParam) => {
      return `${linkParam.key}=${data[linkParam.key]}`
    }).join('&')
    let from = data.user ? data.user.display_name : 'none'
    model['id'] = data['_id']
    model['icon'] = data['inbox']['icon'] ? data['inbox']['icon'] : null
    model['inbox_title'] = data['inbox']['details'].find((detail) =>
      detail.lang === lang
    )['title'].replace('{from}', from)
    model['inbox_content'] = data['inbox']['details'].find((detail) =>
      detail.lang === lang
    )['content'].replace('{from}', `<b style="color: black">${from}</b>`)
    model['link'] = `${data['inbox']['link']['baseLink']['url']}?${params}`
    model['user'] = data['user'] ? await UserProfile.createAPIModel(data['user']) :null
    model['trace'] = data['trace'] ?await Trace.createAPIModel(data['trace']) : null
    model['comment'] = data['comment'] ? await Comment.createAPIModel(data['comment']) : null
    model['type'] = data['comment'] ? 'COMMENT' : data['trace'] ? 'TRACE' : 'OTHER'
    model['is_read'] = data['is_read']
    model['post_date'] = data['created_at']
    return model
  }
}

module.exports = UserInbox
