'use strict'
const NotFoundException = use('App/Exceptions/NotFoundException')
const ReportService = use('App/Services/ReportService')
const TraceCommentService = use('App/Services/TraceCommentService')
const ProfileService = use('App/Services/ProfileService')
const TraceService = use('App/Services/TraceService')

class ReportController {


  /**
   * Create/save.
   * POST
   */
  async store({request, response, auth}) {
    let {type, source_id, message} = request.only(['type', 'source_id', 'message'])
    let user = await auth.user
    let object = null
    if (type === 'USER') {
      object = await ProfileService.getProfileById(source_id)
    } else if (type === 'TRACE') {
      object = await TraceService.getTraceById(source_id)
    } else if (type === 'COMMENT') {
      object = await TraceCommentService.getCommentById(source_id)
    }
    if (!object) {
      throw new NotFoundException()
    }
    let report = await ReportService.sendReport(user._id, type, object._id, message)
    return response.output(null)
  }

}

module.exports = ReportController
