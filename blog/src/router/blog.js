const { getList, getDetail, newBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
    const method = req.method,
          id = req.query.id
         

  if(method === "GET" && req.path === "/api/blog/list"){
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
      req.body.author = 'zhangsan'
      const result = newBlog(req.body)
      return result.then(data => {
          return new SuccessModel(data)
      })
  }
   

  if(method === "POST" && req.path === "/api/blog/update"){
      
  }
}

module.exports = handleBlogRouter