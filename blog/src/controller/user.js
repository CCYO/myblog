const { exec } = require('../db/mysql')

const login = (username, password) => {
  const sql = `
    SELECT username, realname FROM users WHERE username='${username}' and password='${password}';
    `
  return exec(sql).then(rows => {
    if(rows[0]) return rows[0]
    return Promise.reject({dbErrNo: '122', dbErrMsg: 'SQL / 查不到資料'})
  })
}

module.exports = {
    login
}

