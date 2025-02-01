const path = require('path')
const EmailVerification = use('App/Models/EmailVerification')
const Config = require(path.join(__dirname,'../../config/emailVerification'))
const moment = require('moment')

class EmailVerificationService {
  static async getEmailVerificationByEmailAndCode(email,code) {
    const result = await EmailVerification.query().where('code', code).where('is_deleted', false).where('status', true).where('email',email).where({'expire_at':{'$gte':new Date()}}).first()
    return result
  }

  static async getEmailVerificationByEmail(email) {
    const result = await EmailVerification.query().where('email', email).where('is_deleted', false).where('status', true).first()
    return result
  }

  static async updateOrCreateEmailVerification(email, code) {
    const emailVerification = await this.getEmailVerificationByEmail(email)
    const result = emailVerification ? emailVerification : new EmailVerification()
    result.email = email
    result.code = code
    result.expire_at = moment().add(Config.verifyCodeExpired.value, Config.verifyCodeExpired.type).toDate()
    return await result.save()
  }
  static async deleteEmailVerificationByEmail(email){
    const result = await EmailVerification.query().where('is_deleted', false).where('status', true).where('email',email).delete()
    return result
  }
}

module.exports = EmailVerificationService
