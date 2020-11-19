const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    let sql = `SELECT * FROM blogs WHERE 1=1 `
    if(author){
        sql += `and author='${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    
    return exec(sql)
}

const getDetail = (id) => {
    let sql = `SELECT * FROM blogs WHERE id='${id}';`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    const title = blogData.title
    const content = blogData.content
    const createtime = Date.now()
    const author = blogData.author
          
    let sql = `
        INSERT INTO blogs (title, content, createtime, author)                values('${title}', '${content}', ${createtime}, '${author}');
    `
    return exec(sql).then( insertData => {
        console.log('insertData: ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    console.log('UPDATE', id)
    return true
}

const delBlog = (id) => {
    
}

module.exports = {
    getList, getDetail, newBlog, updateBlog
}