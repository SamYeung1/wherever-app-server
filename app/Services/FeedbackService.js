const Feedback = use('App/Models/Feedback')
class FeedbackService {
  static async getFeedbackById(id) {
    const feedback = await Feedback.query().with('user').where('_id', id).where('is_deleted', false).where('status', true).first()
    return feedback
  }
  static async sendFeedback(userId, message) {
    let feedback = await Feedback.create({
      user_id: userId,
      message: message
    })
    return feedback
  }
}

module.exports = FeedbackService
