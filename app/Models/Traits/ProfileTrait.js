'use strict'
let UserProfile = use('App/Models/Profile')

class ProfileTrait {
  async register(Model, customOptions = {}) {
    Model.addHook('beforeCreate', async function (modelInstance) {
      let randomNumber = Math.floor(Math.random() * Math.floor(Number.MAX_VALUE)).toString(16).replace(/0/g,'')
      let accountID = randomNumber
      do {
        accountID = Math.floor(Math.random() * Math.floor(Number.MAX_VALUE)).toString(16).replace(/0/g,'')
      }while ((await UserProfile.where('account_id', accountID).count()) > 0)
        Object.assign(modelInstance, {
          account_id: accountID
        })
    })
  }
}

module.exports = ProfileTrait
