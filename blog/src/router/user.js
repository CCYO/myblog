const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const { get, set } = require("../db/redis.js");

const handleUserRouter = (req, res) => {
  //登錄
  if (req.method === "POST" && req.path === "/api/user/login") {
    //if(req.method === "GET" && req.path === "/api/user/login"){
    const { username, password } = req.body;
    //const {username, password } = req.query
console.log('req.sessionId: ', req.sessionId)    
    return login(username, password)
    .then(data => set(req.sessionId, data))
    .then(data => {
      req.session = data
	console.log('data: ', data)
      return new SuccessModel(req.session)
    })
    .catch(errRes => {
      console.error(errRes.dbErrMsg)
      if(errRes.dbErrNo[0] === '1'){
        return new ErrorModel(errRes)
      }
      if(errRes.dbErrNo[0] === '2'){
        return new SuccessModel(req.session, errRes.dbErrMsg)
      }
    })
  }
};

module.exports = handleUserRouter

