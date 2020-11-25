const {SuccessModel, ErrorModel} = require("../model/resModel")

const handleErr = (errResult) => {
  console.error(errResult.errMsg)
  //mysql查找錯誤，返回ErrorModel，要求Client重填資料
  if(errResult.errFrom < 2){
    return new ErrorModel(errResult.errMsg)
  }
  //redis設值錯誤，返回SuccessModel，在Client打印提醒
  return new SuccessModel(errResult.errMsg)
}

module.exports = {
  handleErr
}
