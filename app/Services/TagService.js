const Tag = use('App/Models/Tag')
const path = require('path')
const AppCst = require(path.join(__dirname, '../../cst/appCst'))

class TagService {
  static async getTagById(id) {
    const tag = await Tag.query().where('_id', id).where('is_deleted', false).where('status', true).first()
    return tag
  }
  static async insertAndCountTag(title) {
    let result = null
    if (await TagService.isExist(title)) {
      result = await TagService.getTagByTitle(title)
      result.count = result.count + 1
      await result.save()
      return result
    } else {
      result = await Tag.create({
        title: title,
        count: 1
      })
    }
    return result
  }

  static async getTagByTitle(title) {
    const result = await Tag.query().where({'title': {
        $regex: `^${title}$`,
        $options: "si"
      }}).where('is_deleted', false).where('status', true).first()
    return result
  }

  static async findTagsByTitle(title) {
    const result = await Tag.query().where({
      'title': {
        $regex: `^${title}.*`,
        $options: "si"
      }
    }).where('is_deleted', false).where('status', true).sort({count:-1}).fetch()
    return result
  }

  static async isExist(title) {
    return await TagService.getTagByTitle(title) != null
  }

  static async createAPIModel(tag, lang) {
    return await Tag.createAPIModel(tag.toJSON ? tag.toJSON() : tag, lang)
  }
}

module.exports = TagService
