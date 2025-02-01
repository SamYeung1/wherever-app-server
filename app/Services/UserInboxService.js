const Inbox = use('App/Models/Inbox')
const UserInbox = use('App/Models/UserInbox')

class UserInboxService {
  static async getInboxByKey(key) {
    let inbox = await Inbox.where('key', key).where('is_deleted', false).first()
    return inbox
  }

  static async updateIsReadUserInboxById(id) {
    let inbox = await UserInbox.find(id)
    if (inbox) {
      inbox.is_read = true
    }
    return await inbox.save()
  }

  static async updateIsReadUserInboxBySendToUserId(send_to_user_id) {
    const result = UserInbox.query()
      .where(function () {
        this.where('is_deleted', false)
        this.where('status', true)
        this.where('send_to_user_id', send_to_user_id)
      })
    return await result.update({is_read: true})
  }

  static async getNumberOfNotIsReadUserInboxBySendToUserId(send_to_user_id) {
    const result = UserInbox.query()
      .where(function () {
        this.where('is_deleted', false)
        this.where('is_read', false)
        this.where('status', true)
        this.where('send_to_user_id', send_to_user_id)
      })
    return (await result.count()) ? await result.count() : 0
  }

  static async getUserInboxById(id) {
    let inbox = await UserInbox.query().where('_id', id)
      .where('is_deleted', false)
      .where('status', true)
      .with('user')
      .with('sendToUser')
      .with('inbox')
      .with('trace').first()
    return inbox
  }

  static async insertCommentInbox(user_id, send_to_user_id, trace_id, comment_id) {
    let userInbox = await UserInbox.create({
      user_id: user_id,
      send_to_user_id: send_to_user_id,
      inbox_key: 'TRACE_COMMENT',
      trace_id: trace_id,
      comment_id: comment_id,
      is_read: false,
    })
    return userInbox
  }

  static async insertReactionInbox(user_id, send_to_user_id, trace_id, type = 'LOVE') {
    let userInbox = await UserInbox.create({
      user_id: user_id,
      send_to_user_id: send_to_user_id,
      inbox_key: 'TRACE_REACTION',
      trace_id: trace_id,
      comment_id: null,
      is_read: false,
    })
    return userInbox
  }

  static async insertFriendAcceptInbox(user_id, send_to_user_id) {
    let userInbox = await UserInbox.create({
      user_id: user_id,
      send_to_user_id: send_to_user_id,
      inbox_key: 'FRIEND_ACCEPT',
      trace_id: null,
      comment_id: null,
      is_read: false,
    })
    return userInbox
  }

  static async getInboxBySendToUserId(send_to_user_id, paginator, queryBuilder = null, sortBy = {'created_at': -1}) {
    const result = await UserInbox.query()
      .where(function () {
        this.where('is_deleted', false)
        this.where('status', true)
        this.where('send_to_user_id', send_to_user_id)
        if (queryBuilder) {
          queryBuilder.queryHelper().forEach((query) => {
            this.where(query.field, query.operator, query.value)
          })
        }
      })
      .with('user')
      .with('sendToUser')
      .with('inbox')
      .with('trace')
      .sort(sortBy).paginate(paginator.page, paginator.limit)
    return result
  }

  static async createAPIModel(userInbox, lang) {
    return await UserInbox.createAPIModel(userInbox.toJSON ? userInbox.toJSON() : userInbox, lang)
  }
}

module.exports = UserInboxService
