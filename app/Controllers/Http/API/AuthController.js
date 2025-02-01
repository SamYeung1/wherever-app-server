'use strict'
const Encryption = use('Encryption')
const Env = use('Env')
const Mail = use('Mail')
const Hash = use('Hash')
const User = use('App/Models/User')
const path = require('path')
const StringUtil = require(path.join(__dirname, '../../../../util/stringUtil'))
const ProfileService = use('App/Services/ProfileService')
const EmailVerificationService = use('App/Services/EmailVerificationService')
const UserService = use('App/Services/UserService')
const AuthException = use('App/Exceptions/AuthException')
const NotFoundException = use('App/Exceptions/NotFoundException')
const UserVerifyException = use('App/Exceptions/UserVerifyException')
const moment = require('moment')

class AuthController {
  async register({request, response, auth}) {
    let user = await User.create({
      ...request.only(['email', 'password']),
      is_verify: !(Env.get('NODE_ENV') !== 'development')
    })
    if (await ProfileService.insertProfile({
      user, ...request.only(['display_name', 'birthday', 'account_id', 'gender'])
    })) {
      if(Env.get('NODE_ENV') !== 'development'){
        await sendVerificationEmail(user.email)
      }
    }
    return response.output(null)
  }

  async login({request, response, auth}) {
    let {email, password} = request.all()
    try {
      //if (await auth.attempt(email, password)) {
      // let user = await User.findBy('email', email)
      let token = await auth.withRefreshToken().attempt(email, password)
      let timeStr = Env.get('AUTH_TOKEN_EXPIRY').split('')
      token['expiry_date'] = moment().add(Number.parseInt(timeStr[0]) - 1, timeStr[1]).toDate().getTime()
      return response.output(token)
      // }
    } catch (e) {
      console.log(e)
      throw new AuthException()
    }
  }

  async logout({request, response, auth}) {
    const user = auth.current.user
    await user
      .tokens()
      .delete()
    return response.output(null)
  }

  async refresh({response, request, auth}) {
    try {
      const refreshToken = request.input('refresh_token')
      let result = await auth
        .newRefreshToken()
        .generateForRefreshToken(refreshToken)

      let timeStr = Env.get('AUTH_TOKEN_EXPIRY').split('')
      result['expiry_date'] = moment().add(Number.parseInt(timeStr[0]) - 1, timeStr[1]).toDate().getTime()
      return response.output(result)
    } catch (e) {
      console.log(e)
      throw new AuthException()
    }
  }

  async changePassword({request, response, auth}) {
    let {new_password, current_password} = request.only(['new_password', 'current_password'])
    let user = await auth.user
    let hash = await Hash.verify(current_password, user.password)
    if (!hash) {
      throw new AuthException()
    }
    user.password = new_password
    await user.save()
    return response.output(null)
  }


  async forgotPassword({request, response}) {
    let {email} = request.only(['email'])
    let user = await UserService.getUserByEmail(email)
    if (!user) {
      throw new NotFoundException()
    }

    let password = StringUtil.generatePassword()
    user.password = password
    if ((await user.save())) {
      await Mail.send('emails.forgetpassword', {password: password}, (message) => {
        message
          .to(user.email)
          .from(Env.get('MAIL_FROM'))
          .subject('Wherever Forgot Password')
      })
      return response.output(null)
    } else {
      throw new NotFoundException()
    }
  }

  async sendVerifyEmail({request, response, auth}) {
    let user = await auth.user
    let {resend} = request.only(['resend'])
    if (resend && resend === '1') {
      await sendVerificationEmail(user.email)
    } else {
      if (!(await EmailVerificationService.getEmailVerificationByEmail(user.email))) {
        await sendVerificationEmail(user.email)
      }
    }
    return response.output(null)
  }

  async verifyCode({request, response, auth}) {
    let user = await auth.user
    let {code} = request.only(['code'])
    let emailCode = await EmailVerificationService.getEmailVerificationByEmailAndCode(user.email, `W-${code}`)
    if (!emailCode) {
      throw new UserVerifyException()
    }
    user.is_verify = true
    if (await user.save()) {
      await EmailVerificationService.deleteEmailVerificationByEmail(user.email)
    }
    return response.output(null)
  }
}

async function sendVerificationEmail(email) {
  let code = StringUtil.generateCode('W', 5)
  let result = await EmailVerificationService.updateOrCreateEmailVerification(email, code)
  if (result) {
    await Mail.send('emails.verification', {code: code}, (message) => {
      message
        .to(email)
        .from(Env.get('MAIL_FROM'))
        .subject('Wherever Email Verification')
    })
  }
}

module.exports = AuthController
