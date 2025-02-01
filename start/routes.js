'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const API_MIDDLEWARE = ['auth','blackList', 'userVerify']
const addPrefixToGroupWithAPI = (group) => {
  group.prefix('whereverapp/api')
  return group
}

const AuthGroup = () => {
  Route.post('register', 'API/AuthController.register').validator('UserProfile')
  Route.post('login', 'API/AuthController.login').middleware(['guest'])
  Route.post('refresh', 'API/AuthController.refresh')
  Route.post('logout', 'API/AuthController.logout').middleware(API_MIDDLEWARE)
  Route.post('forgotPassword', 'API/AuthController.forgotPassword')
  Route.post('changePassword', 'API/AuthController.changePassword').validator('ChangePassword').middleware(API_MIDDLEWARE)
  Route.post('verifySend', 'API/AuthController.sendVerifyEmail').middleware(['auth'])
  Route.post('verify', 'API/AuthController.verifyCode').middleware(['auth']).validator('EmailVerification')
}
const UserGroup = () => {
  Route.get('', 'API/UserController.findProfile')
  Route.get(':id', 'API/UserController.show')
  Route.get('/:user_id/trace', 'API/UserController.listTraces').middleware(['onlyFriend'])
  Route.put('/icon', 'API/UserController.updateIcon')
  Route.delete('/icon', 'API/UserController.deleteIcon')
  Route.put('/profileIcon', 'API/UserController.updateProfileIcon')
  Route.delete('/profileIcon', 'API/UserController.deleteProfileIcon')
  Route.put('', 'API/UserController.update')
}


const ImageTraceGroup = () => {
  Route.get('', 'API/ImageTraceController.index').validator('Geo')
  Route.get(':id', 'API/ImageTraceController.show')
  Route.post('', 'API/ImageTraceController.store')
  Route.put(':id', 'API/ImageTraceController.update')
  Route.delete(':id', 'API/ImageTraceController.destroy')
}
const CommentGroup = () => {
  Route.get('', 'API/TraceCommentController.index')
  Route.get(':id', 'API/TraceCommentController.show')
  Route.post('', 'API/TraceCommentController.store').validator('TraceComment')
  Route.put(':id', 'API/TraceCommentController.update')
  Route.delete(':id', 'API/TraceCommentController.destroy')
}
const RequestGroup = () => {
  Route.get('', 'API/RequestController.index')
  Route.post('/friend', 'API/RequestController.sendFriendRequest').validator('FriendRequest')
  Route.post('friend/cancel', 'API/RequestController.cancelFriendRequest').validator('FriendRequest')
  Route.put('/friend', 'API/RequestController.acceptFriendRequest')
  Route.delete('/friend', 'API/RequestController.denyFriendRequest').validator('Request')
}
const FriendGroup = () => {
  Route.get('', 'API/FriendController.index')
  Route.delete(':id', 'API/FriendController.destroy')
}
const InboxGroup = () => {
  Route.get('', 'API/InboxController.index')
  Route.get(':id', 'API/InboxController.show')
  Route.put(':id', 'API/InboxController.update')
  Route.put('', 'API/InboxController.updateAll')
  Route.delete(':id', 'API/InboxController.destroy')
}
const ReactionHistoryGroup = () => {
  Route.get('', 'API/TraceReactionHistoryController.index')
  Route.post('', 'API/TraceReactionHistoryController.store').validator('TraceReactionHistory')
  Route.delete('', 'API/TraceReactionHistoryController.destroy')
}

const UserFavouriteGroup = () => {
  Route.get('', 'API/UserFavouriteController.index')
  Route.put('', 'API/UserFavouriteController.update').validator('Favourite')
  Route.delete('', 'API/UserFavouriteController.destroy').validator('Favourite')
}
const TagGroup = () => {
  Route.get('', 'API/TagController.index')
}

const AppVersionGroup = () => {
  Route.post('', 'API/VersionController.checkVersion').validator('Version')
}

const HomeGroup = () => {
  Route.get('', 'API/HomeController.index')
}

const ReportGroup = () => {
  Route.post('', 'API/ReportController.store').validator('Report')
}

const FeedbackGroup = () => {
  Route.post('', 'API/FeedbackController.store').validator('Feedback')
}

addPrefixToGroupWithAPI(Route.group(AuthGroup).prefix('authorize'))
addPrefixToGroupWithAPI(Route.group(UserGroup).prefix('profile')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(ImageTraceGroup).prefix('trace_image')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(CommentGroup).prefix('comment')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(RequestGroup).prefix('request')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(FriendGroup).prefix('friend')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(InboxGroup).prefix('inbox')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(ReactionHistoryGroup).prefix('reaction')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(UserFavouriteGroup).prefix('favourite')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(TagGroup).prefix('tag')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(AppVersionGroup).prefix('version'))
addPrefixToGroupWithAPI(Route.group(HomeGroup).prefix('home')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(ReportGroup).prefix('report')).middleware(API_MIDDLEWARE)
addPrefixToGroupWithAPI(Route.group(FeedbackGroup).prefix('feedback')).middleware(API_MIDDLEWARE)

