'use strict'
const NotFoundException = use('App/Exceptions/NotFoundException')
const FeedbackService = use('App/Services/FeedbackService')
const Mail = use('Mail')
const Env = use('Env')

class FeedbackController {


  /**
   * Create/save.
   * POST
   */
  async store({request, response, auth}) {
    let {message} = request.only(['message'])
    let user = await auth.user
    let feed = await FeedbackService.sendFeedback(user._id, message)
    await Mail.send('emails.feedback', {message: feed.message,user:user}, (message) => {
      message
        .to(Env.get('FEEDBACK_MAIL_TO'))
        .from(Env.get('FEEDBACK_MAIL_FROM'))
        .subject('Feedback')
    })
    return response.output(null)
  }

}

module.exports = FeedbackController
