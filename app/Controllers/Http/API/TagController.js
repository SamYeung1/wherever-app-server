const TagService = use('App/Services/TagService')

class TagController {
  /**
   * Show a list of all.
   * GET
   */
  async index({request, response, auth}) {
    let {q} = request.all()
    let tags = await TagService.findTagsByTitle(q)
    return response.output(await Promise.all(tags.toJSON().map(async (tag)=> await TagService.createAPIModel(tag,request.getLang()))))
  }
}

module.exports = TagController
