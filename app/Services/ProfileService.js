const UserProfile = use('App/Models/Profile')
const UploaderService = use('App/Services/UploaderService');

class ProfileService {
  static async getProfileById(id) {
    const result = await UserProfile.query().with('user').where('user_id', id).where('is_deleted', false).where('status', true).first()
    return result
  }

  static async findProfilesByDisplayNameOrEmailNotMe(self, text, paginator, sortBy = {'display_name': 1}) {
    let condition = [{
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
      {$unwind: '$user'},
      {
        $match: {
          $or: [{
            'display_name': {
              $regex: `^${text}.*`,
              $options: "si"
            }
          },
            {
              'user.email': text
            }
          ],
          'user.is_verify':true,
          'user.status':true,
          'user.is_deleted':false,
          user_id: {$ne: self._id}
        }
      }]
    const result = await UserProfile.query().aggregate([
      {
        $facet: {
          data: [
            ...condition,
            {$sort: sortBy},
            {$skip: paginator.limit * (paginator.page - 1)},
            {$limit: paginator.limit},
          ],
          pageInfo:
            [
              ...condition,
              {$group: {_id: null, total: {$sum: 1}}}
            ]
        }
      },
      {
        $unwind: '$pageInfo'
      }
    ])
    return result[0]
  }

  static async insertProfile({user, display_name, birthday, account_id, gender, icon, profile_icon, about_me,is_verify = false}) {
    let profile = await UserProfile.create({
      user_id: user._id,
      display_name: display_name,
      birthday: birthday,
      account_id: account_id,
      gender: gender,
      icon: icon,
      profile_icon: profile_icon,
      about_me: about_me
    })
    return profile
  }

  static async uploadIcon(id, file) {
    const time = Date.now().toString()
    return await UploaderService.uploadImage(file, `profile/${id}/`, `icon_${time}`, 500)
  }

  static async uploadProfileIcon(id, file) {
    const time = Date.now().toString()
    return await UploaderService.uploadImage(file, `profile/${id}/`, `profile_icon_${time}`, 600)
  }

  static async deleteImage(id, path) {
    return await UploaderService.deleteImage(`${path}`)
  }

  static async updateProfile(id, {display_name, birthday, account_id, gender, icon, profile_icon, about_me}) {
    let profile = await UserProfile.query().where('user_id', id).first()
    if (display_name)
      profile.display_name = display_name
    if (birthday)
      profile.birthday = birthday
    if (account_id)
      profile.account_id = account_id
    if (gender)
      profile.gender = gender
    if (icon)
      profile.icon = icon
    if (profile_icon)
      profile.profile_icon = profile_icon
    profile.about_me = about_me
    return await profile.save()
  }

  static async removeIcon(id) {
    let profile = await UserProfile.query().where('user_id', id).first()
    profile.icon = null
    return await profile.save()
  }

  static async removeProfileIcon(id) {
    let profile = await UserProfile.query().where('user_id', id).first()
    profile.profile_icon = null
    return await profile.save()
  }

  static async createAPIModel(profile) {
    return await UserProfile.createAPIModel(profile.toJSON ? profile.toJSON() : profile)
  }
}

module.exports = ProfileService
