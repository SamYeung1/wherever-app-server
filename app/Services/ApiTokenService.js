const APIToken = use('App/Models/APIToken')

class ApiTokenService {
  static async getAPITokenByToken(token) {
    const result = await APIToken.query().where('api_token', token).where('is_deleted',false).first()
    return result
  }

  static async insertAPIToken({api_token}) {
    let apiToken = await APIToken.create({
      api_token:api_token
    })
    return apiToken
  }
}

module.exports = ApiTokenService
