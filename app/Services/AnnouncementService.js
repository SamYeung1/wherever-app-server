const Announcement = use('App/Models/Announcement')
const moment = require('moment')

class AnnouncementService {
  static async getAnnouncements() {

    let announcements = await Announcement.query()
      .where({
        start_at: {
          '$lte': moment().toDate()
        },
        end_at:{
          '$gte':moment().toDate()
        }
      })
      .where('is_deleted', false)
      .where('status', true)
      .fetch()
    return announcements
  }

  static async createAPIModel(announcement, lang) {
    return await Announcement.createAPIModel(announcement.toJSON ? announcement.toJSON() : announcement, lang)
  }
}

module.exports = AnnouncementService
