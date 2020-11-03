const { exec } = require('../db/mysql')

const login = (username, password) => {
    const sql = `
        SELECT username, realname FROM users WHERE username='${username}' and password='${password}';
    `
    return exec(sql).then(rows => {
        console.log('找到user了,它是 ',rows[0])
        return rows[0] || {}
    })
}

module.exports = {
    login
}