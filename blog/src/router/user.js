const { login } = require("../controller/user");
const { handleErr } = require("../db/handleErr");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const { get, set } = require("../db/redis.js");

const handleUserRouter = (req, res) => {
  //驗證登入狀態
  if (req.method === "GET" && req.path === "/api/user/login") {
    if(!req.session.username){
      return Promise.resolve(new ErrorModel())
    }
    return Promise.resolve(new SuccessModel())
  }

  //登錄
  if (req.method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    return login(username, password)
    //登入成功，設置Session(存入redis)
    .then(data => set(req.cookie.userId, data))
    //Session設置成功
    .then(data => {
      return new SuccessModel(req.session)
    })
    //處理錯誤，在Server打印提醒
    .catch(errRes => handleErr(errRes))
  }
};

module.exports = handleUserRouter

