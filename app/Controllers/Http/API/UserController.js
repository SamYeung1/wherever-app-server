'use strict'
const path = require('path')
const Paginator = require(path.join(__dirname, '../../../../util/paginator'))
const StringUtil = require(path.join(__dirname, '../../../../util/stringUtil'))
const TraceService = use('App/Services/TraceService')
const FriendService = use('App/Services/FriendService')
const ProfileService = use('App/Services/ProfileService')
const UserService = use('App/Services/UserService')
const RequestService = use('App/Services/RequestService')
const NotFoundException = use('App/Exceptions/NotFoundException')


class UserController {
  async listTraces({params: {user_id}, auth, request, response}) {
    let authUser = await auth.user
    let userId = user_id !== 'me' ? user_id : authUser._id.toString()
    let user = await ProfileService.getProfileById(userId)
    if (!user) {
      throw new NotFoundException()
    }
    let traces = await TraceService.getTraceByUserId(Paginator.parsePaginate(request), user.user_id)

    let tracesJson = (await traces).toJSON()
    let data = await Promise.all(tracesJson.data.map(async(trace) => await TraceService.createAPIModel(trace)))
    return response.outputWithPaging(data, tracesJson.total, tracesJson.lastPage)
  }

  async show({response, auth, params: {id}}) {
    let authUser = await auth.user
    let user_id = id !== 'me' ? id : authUser._id.toString()
    let user = await ProfileService.getProfileById(user_id)
    if (!user) {
      throw new NotFoundException()
    }
    let apiModel = await ProfileService.createAPIModel(user)
    let self = authUser._id.toString() == user.user_id.toString()
    apiModel['friend_status'] = await getFriendStatus(authUser, user)
    apiModel['is_me'] = self
    return response.output(apiModel)
  }

  async update({response, request, auth}) {
    let user = await auth.user
    await ProfileService.updateProfile(user._id, request.all())
    return response.output(null)
  }

  async updateIcon({response, request, auth}) {
    let user = await auth.user
    let profile = await ProfileService.getProfileById(user._id)
    request.multipart.file('src', {}, async (file) => {
      await ProfileService.deleteImage(user._id, profile.icon)
      await ProfileService.updateProfile(user._id, {icon: await ProfileService.uploadIcon(user._id, file)})
    })
    await request.multipart.process()
    return response.output(await ProfileService.createAPIModel(await ProfileService.getProfileById(user._id)))
  }

  async deleteIcon({response, request, auth}) {
    let user = await auth.user
    let profile = await ProfileService.getProfileById(user._id)
    await ProfileService.deleteImage(user._id, profile.icon)
    await ProfileService.removeIcon(user._id)
    return response.output(await ProfileService.createAPIModel(await ProfileService.getProfileById(user._id)))
  }

  async updateProfileIcon({response, request, auth}) {
    let user = await auth.user
    let profile = await ProfileService.getProfileById(user._id)
    request.multipart.file('src', {}, async (file) => {
      await ProfileService.deleteImage(user._id, profile.profile_icon)
      await ProfileService.updateProfile(user._id, {profile_icon: await ProfileService.uploadProfileIcon(user._id, file)})
    })
    await request.multipart.process()
    return response.output(await ProfileService.createAPIModel(await ProfileService.getProfileById(user._id)))
  }

  async deleteProfileIcon({response, request, auth}) {
    let user = await auth.user
    let profile = await ProfileService.getProfileById(user._id)
    await ProfileService.deleteImage(user._id, profile.profile_icon)
    await ProfileService.removeProfileIcon(user._id)
    return response.output(await ProfileService.createAPIModel(await ProfileService.getProfileById(user._id)))
  }

  async findProfile({request, response, auth}) {
    let {q} = request.only(['q'])
    let user = await auth.user
    let results = []
    let profileResult = q ? await ProfileService.findProfilesByDisplayNameOrEmailNotMe(user,q, Paginator.parsePaginate(request)) : null
    for (let profile of profileResult ? profileResult.data : []) {
      let model = await ProfileService.createAPIModel(profile)
      model['friend_status'] = await getFriendStatus(user, profile)
      model['is_me'] = user._id.toString() == profile.user_id.toString()
      results.push(model)
    }
    let total = profileResult ? profileResult.pageInfo.total : 0
    return response.outputWithPaging(results, total, Math.floor(total / request.input('limit')))
  }
}

async function getFriendStatus(authUser, user) {
  let self = authUser._id.toString() == user.user_id.toString()
  if (self) {
    return null
  }
  if (await FriendService.isExist(authUser._id, user.user_id)) {
    return 'FRIEND'
  } else if (await RequestService.isSourceExist(authUser._id, user.user_id, 'FRIEND')) {
    return 'REQUEST_SENT'
  } else if (await RequestService.isSenderExist(authUser._id, user.user_id, 'FRIEND')) {
    return 'ACCEPT_REQUEST'
  }
}

module.exports = UserController
