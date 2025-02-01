const Friend = use('App/Models/Friend')
const Profile = use('App/Models/Profile')

class FriendService {
  static async createFriend(user_id, related_user_id) {
    let tasks = [
      Friend.create({
        user_id: user_id,
        related_user_id: related_user_id
      }),
      Friend.create({
        user_id: related_user_id,
        related_user_id: user_id
      })
    ]
    return await Promise.all(tasks)
  }

  static async deleteFriend(user_id, related_user_id) {
    let userFriend = await Friend.where('user_id', user_id).where('related_user_id', related_user_id).first()
    let relatedUserFriend = await Friend.where('user_id', related_user_id).where('related_user_id', user_id).first()
    let tasks = [
      userFriend.delete(),
      relatedUserFriend.delete()
    ]
    return await Promise.all(tasks)
  }

  static async getFriendsUserId(user_id, paginator, queryBuilder = null, sortBy = {'updated_at.display_name': -1}) {
    const result = await Friend.query()
      .where('user_id', user_id)
      .where(function () {
        this.where('is_deleted', false)
        this.where('status',true)
        if (queryBuilder) {
          queryBuilder.queryHelper().forEach((query) => {
            this.where(query.field, query.operator, query.value)
          })
        }
      })
      .with('user')
      .with('relatedUser')
      .sort(sortBy).paginate(paginator.page, paginator.limit)
    return result
  }

  static async isExist(user_id, related_user_id) {
    let friends = await Friend.where({'$or':[{'user_id': user_id,'related_user_id': related_user_id},{'user_id': related_user_id,'related_user_id': user_id}]}).count()
    return friends > 0
  }
  static async createAPIModel(friend) {
    return await Profile.createAPIModel(friend.toJSON ? friend.toJSON().relatedUser : friend.relatedUser)
  }
}

module.exports = FriendService
