const Report = use('App/Models/Report')
class ReportService {
  static async sendReport(userId, type, sourceId, message) {
    let report = await Report.create({
      user_id: userId,
      type: type,
      source_id: sourceId,
      message: message
    })
    return report
  }
}

module.exports = ReportService
