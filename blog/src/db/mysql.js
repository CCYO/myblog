const mysql = require('mysql')

const { MYSQL_CONF } = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONF)

con.connect((error) => {
    if(error){
        console.error('SQL / 連結錯誤 / 原因 >>> ', error)
        return
    }
    console.log('SQL / 連結成功')
    return
})

const exec = (sql) => {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err){ 
              return reject({errFrom: '1', errMsg: err})	
            }
            return resolve(result)
        })
    })
    return promise
}

module.exports = { 
	escape: mysql.escape,
	exec
}
