'use strict'

class TraceController {
  /**
   * Show a list of all.
   * GET
   */
  async index({request, response, auth}) {
    return response.output('index')
  }

  /**
   * Create/save.
   * POST
   */
  async store({request, response, auth}) {
    return response.output(request.all())
  }

  /**
   * Display.
   * GET
   */
  async show({params, request, response, auth}) {
    return response.output(params.id)
  }

  /**
   * Update.
   * PUT or PATCH
   */
  async update({params, request, response}) {
    return response.output(params.id)
  }

  /**
   * Delete.
   * DELETE contacts/:id
   */
  async destroy({params, request, response}) {
    return response.output(params.id)
  }
}

module.exports = TraceController
