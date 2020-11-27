const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { handleErr } = require('../db/handleErr')
const loginCheck = (req) => {
    if(!req.session.username){
        return Promise.resolve(new ErrorModel('尚未登錄'))
    }
}

const handleBlogRouter = (req, res) => {

  const method = req.method
  const id = req.query.id

  if(method === "GET" && req.path === "/api/blog/list"){
      if(req.query.admin){
        const loginCheckResult =  loginCheck(req)
        if(loginCheckResult){
	  return loginCheckResult
        }
        return getList(req.session.username)
	  .then(listData => new SuccessModel(listData))
	  //處理mysql報錯
	  .catch(handleErr)
      }
      const author = req.query.author || ''
      const keyword = req.query.keyword || ''
      return getList(author, keyword)
	.then(listData => {
          return new SuccessModel(listData)
        })
	.catch(handleErr)
  }
   

  if(method === "GET" && req.path === "/api/blog/detail"){
      const result = getDetail(id)
      return result
	.then(data => {
          return new SuccessModel(data)
        })
	.catch(handleErr)
  }
   

  if(method === "POST" && req.path === "/api/blog/new"){
    const loginCheckResult = loginCheck(req)  
    if(loginCheckResult){
        return loginCheckResult
    }
    req.body.author = req.session.username
    return newBlog(req.body)
      .then(result => new SuccessModel(result.msg))
      .catch(handleErr)
  }

  if(method === "POST" && req.path === "/api/blog/update"){
        const loginCheckResult = loginCheck(req)  
        if(loginCheckResult){
            return loginCheckResult
        }
	
        return updateBlog(req.query.id, req.body)
	  .then(result => new SuccessModel(result.msg))
	  .catch(handleErr)
    }

    if(method === 'POST' && req.path === '/api/blog/del'){
        const loginCheckResult = loginCheck(req)  
        if(loginCheckResult){
            return loginCheckResult
        }
        req.body.author = req.session.username
console.log('req.body.id', req.body.id)
        return delBlog(req.body)
          .then(result => new SuccessModel(result.msg))
          .catch(handleErr)
    }
}

module.exports = handleBlogRouter
