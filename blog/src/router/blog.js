const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

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
        return getList(req.session.username).then(listData => new SuccessModel(listData))
      }
      const author = req.query.author || ''
      const keyword = req.query.keyword || ''
      const result = getList(author, keyword)
      return result.then(listData => {
          return new SuccessModel(listData)
      })
  }
   

  if(method === "GET" && req.path === "/api/blog/detail"){
      const result = getDetail(id)
      return result.then(data => {
          return new SuccessModel(data)
      })
  }
   

  if(method === "POST" && req.path === "/api/blog/new"){
    const loginCheckResult = loginCheck(req)  
    if(loginCheckResult){
        return loginCheckResult
    }
      req.body.author = req.session.username
      const result = newBlog(req.body)
      return result
		.then(data => {
			return new SuccessModel(data)
		})
		.catch(errResult => {
			console.log(`報錯,dbErrNo >>> ${errResult.dbErrNo}, dbErrMsg >>> ${errResult.dbErrMsg}`)
			return new ErrorModel(errResult)
		})
  }

  if(method === "POST" && req.path === "/api/blog/update"){
        const loginCheckResult = loginCheck(req)  
        if(loginCheckResult){
            return loginCheckResult
        }
	
        const result = updateBlog(req.query.id, req.body)
        return result.then(val => {
            if(val){
                return new SuccessModel()
            } else {
                return new ErrorModel('更新Blog失敗')
            }
        })
    }

    if(method === 'POST' && req.path === '/api/blog/del'){
        const loginCheckResult = loginCheck(req)  
        if(loginCheckResult){
            return loginCheckResult
        }
        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if(val){
                return new SuccessModel()
            } else {
                return new ErrorModel('刪除Blog失敗')
            }
        })
    }
}

module.exports = handleBlogRouter
