'use strict'

class Deletable {
  register(Model) {
    Model.addHook('beforeCreate', function (modelInstance) {
      Object.assign(modelInstance, {
        is_deleted: false,
        status: true,
        created_by: null,
        updated_by: null
      })
    })
  }
}

module.exports = Deletable
