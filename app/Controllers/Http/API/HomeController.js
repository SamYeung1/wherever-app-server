const UserInboxService = use('App/Services/UserInboxService')
const AnnouncementService = use('App/Services/AnnouncementService')
const RequestService = use('App/Services/RequestService')

class HomeController {

  async index({request, response, auth}) {
    let user = await auth.user
    return response.output({
      'number_of_inbox': await UserInboxService.getNumberOfNotIsReadUserInboxBySendToUserId(user._id),
      'announcements': await Promise.all((await AnnouncementService.getAnnouncements()).toJSON().map( async(announcement)=>{
        return await AnnouncementService.createAPIModel(announcement,request.getLang())
      })),
      'number_of_request':(await RequestService.getNumberOfRequestBySourceId(user._id))
    })
  }
}

module.exports = HomeController
