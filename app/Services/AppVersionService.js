const AppVersion = use('App/Models/AppVersion')

class AppVersionService {
  static async isLatestVersion(currentVersion, platform) {
    const result = await AppVersion.query().where('platform', platform).where('is_deleted', false).where('status', true).first()
    return result ?  currentVersion >= result.version : false
  }
  static async isForceUpdate(platform){
    const result = await AppVersion.query().where('platform', platform).where('is_deleted', false).where('status', true).first()
    return result ? result.is_force : false
  }
  static async getLatestVersionUrl(platform){
    const result = await AppVersion.query().where('platform', platform).where('is_deleted', false).where('status', true).first()
    return result ? result.url : null
  }

}

module.exports = AppVersionService
