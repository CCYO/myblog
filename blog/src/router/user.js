const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')



const handleUserRouter = (req, res) => {
    //登錄
    if(req.method === "POST" && req.path === "/api/user/login"){
    //if(req.method === "GET" && req.path === "/api/user/login"){
        const {username, password } = req.body
        //const {username, password } = req.query
        const result = login(username, password)
        return result.then( data => {
            if(data.username){
                set(req.cookie.userId,
                    {
                        username: data.username,
                        realname: data.realname
                    }
                )
                return new SuccessModel('登入成功')
            }
            return new ErrorModel('登入失敗')
        })
    }
}

module.exports = handleUserRouter