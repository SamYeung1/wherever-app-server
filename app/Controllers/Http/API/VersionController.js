const AppVersionService = use('App/Services/AppVersionService')

class VersionController {

  /**
   * Create/save.
   * POST
   */
  async checkVersion({request, response}) {
    let {current_version, platform} = request.only(['current_version', 'platform'])
    let isLatestVersion = await AppVersionService.isLatestVersion(current_version, platform)
    let isForceUpdate = await AppVersionService.isForceUpdate(platform)
    return response.output({
      is_latest_version:isLatestVersion,
      is_force_update:isForceUpdate,
      url:await AppVersionService.getLatestVersionUrl(platform)
    })
  }
}

module.exports = VersionController
