const UserInboxService = use('App/Services/UserInboxService')

class InboxHelper {
  static async sendCommentInbox(user, trace, comment) {
    if (user._id.toString() != trace.user_id.toString()) {
      return await UserInboxService.insertCommentInbox(user._id, trace.user_id, trace._id, comment._id)
    } else {
      return await null
    }
  }
  static async sendReactionInbox(user, trace, reactionHistory) {
    if (user._id.toString() != trace.user_id.toString()) {
      return await UserInboxService.insertReactionInbox(user._id, trace.user_id, trace._id)
    } else {
      return await null
    }
  }
}
module.exports = InboxHelper
