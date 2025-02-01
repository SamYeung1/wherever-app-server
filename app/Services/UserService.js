const User = use('App/Models/User')
const ObjectId = require('bson-objectid')

class UserService {
  static async getUserById(id) {
    const result = await User.query().find(id)
    return result
  }

  static async getUserByEmail(email) {
    const result = await User.query().where('email', email).where('is_deleted', false).where('status', true).first()
    return result
  }

  static async updatePassword(id, password) {
    const result = await User.find(id)
    result.password = password
    return await result.save()
  }
}

module.exports = UserService
