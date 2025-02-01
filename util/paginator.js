module.exports = {
  parsePaginate(request){
    return {page:parseInt(request.input('p',1)),limit:parseInt(request.input('limit',10))}
  }
}
