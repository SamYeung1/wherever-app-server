'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  verifyCodeExpired:{
    value:Env.get('EMAIL_VERIFICATION_CODE_EXPIRY'),
    type:Env.get('EMAIL_VERIFICATION_CODE_EXPIRY_TYPE')
  },
}
