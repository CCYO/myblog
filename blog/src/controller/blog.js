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
        INSERT INTO blogs (title, content, createtime, author) values('${title}', '${content}', ${createtime}, '${author}');
    `
    return exec(sql).then( insertData => {
	console.log('【router/blog.js:newBlog()】insertData >>> ', insertData)
	return { id: insertData.id}
    })
}


const updateBlog = (id, blogData = {}) => {
	const sql = `UPDATE blogs SET title='${blogData.title}', content='${blogData.content}', createtime=${blogData.createtime} where id='${id}';`
	return exec(sql)
		.then(updateData => {
			let txt = ''
			for(key in updateData){
				txt += `${key} : ${updateData[key]} | `				
			}
			console.log(`【controller/blog.js:updateBlog()】updateData >>> ${txt}`)
			console.log('----------------')
			console.log('updateData.affectedRows: ', updateData.affectedRows)
			return {id: updateData.id}
		})
		.catch(err => {
			console.log('---------!!!!!!----------- ', err.dbErrMsg)
			return err
		})
}




const delBlog = (id) => {
    
}

module.exports = {
    getList, getDetail, newBlog, updateBlog
}
