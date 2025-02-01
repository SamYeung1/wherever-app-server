class QueryBuilder {
  constructor() {
    this.queryList = []
  }

  addQuery(query) {
    this.queryList.push(query)
  }

  queryHelper() {
    return this.queryList
  }
}

QueryBuilder.Query = class Query {
  constructor(field, operator, value) {
    this.field = field
    this.operator = operator
    this.value = value
  }
}
module.exports = QueryBuilder

