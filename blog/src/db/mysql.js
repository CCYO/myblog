const mysql = require('mysql')

const { MYSQL_CONF } = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONF)

con.connect((error) => {
    if(error){
        console.error('SQL連結錯誤,原因是', error)
        return
    }
    console.log('成功連結')
    return
})

const exec = (sql) => {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err){ return reject(err)}
            return resolve(result)
        })
    })
    return promise
}

module.exports = { exec }