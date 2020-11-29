const { exec, escape } = require('../db/mysql')

const login = (username, password) => {
  username = escape(username)
  password = escape(password)
  const sql = `
    SELECT username, realname FROM users WHERE username=${username} and password=${password};
`
  return exec(sql).then(rows => {
    if(rows[0]) return rows[0]
    return Promise.reject({errFrom: 1, errMsg: '查無資料'})
  })
}

module.exports = {
    login
}

