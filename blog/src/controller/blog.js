const { exec, escape } = require('../db/mysql')

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
      if(rows[0]) return rows[0]
      return Promise.reject({errFrom: 1, errMsg: '查無該文章'})	
    })
}

const newBlog = (blogData = {}) => {
    const title = escape(blogData.title)
    const content = escape(blogData.content)
    const createtime = Date.now()
    const author = blogData.author
          
    let sql = `
        INSERT INTO blogs (title, content, createtime, author) values(${title}, ${content}, ${createtime}, '${author}');
    `
    return exec(sql)
	.then( insertData => {
          if(!insertData.insertId) return Promise.reject({errFrom: 1, errMsg: '新增文章失敗'})
	  //觀察insertData內容
	  let insertDataTxt = ''
	  for(key in insertData){
	    insertDataTxt += `${key}:${insertData[key]} | `
	  }
	  console.log(`【router/blog.js:newBlog()】insertData >>> ${insertDataTxt}`)
	  return { msg: '新增Blog成功'}
	})
}


const updateBlog = (id, blogData = {}) => {
    const title = escape(blogData.title)
    const content = escape(blogData.content)
    const createtime = Date.now()
    const author = blogData.author
	const sql = `UPDATE blogs SET title=${title}, content=${content}, createtime=${createtime} where author='${author}' and id=${id};`
	return exec(sql)
	  //觀察updateData內容
		.then(updateData => {
          		if(!updateData.affectedRows) return Promise.reject({errFrom: 1, errMsg: '更新文章失敗'})
			let txt = ''
			for(key in updateData){
				txt += `${key} : ${updateData[key]} |`
			}
			console.log(`【controller/blog.js:updateBlog()】updateData >>> ${txt}`)
			return {msg: 'updete Blog成功'}
		})
}




const delBlog = (delData={}) => {
  const sql_safe = exec('SET SQL_SAFE_UPDATES = 0;')
  const id = delData.id
  const author = delData.author
  return  sql_safe
    .then(data => {
      console.log('【controller/blog.js:sql_safe】data >>>>>>>>>>>>>')
      for(key in data){
        console.log(`${key} : ${data[key]} |`)
      }
    })
    .then( _ => {
      const sql = `DELETE FROM blogs WHERE id='${id}' and author='${author}';`
      return exec(sql)
        .then(deleteData => {
          console.log(`【controller/blog.js:delBlog()】deleteData >>>`)
          for(key in deleteData){
            console.log(`${key} : ${deleteData[key]} |`)
          }
          console.log('<<<<<<<<<<<<<<<<<<<<<<<<<')
          return {msg: 'delete Blog 成功'}
        })
    })
}

module.exports = {
    getList, getDetail, newBlog, updateBlog, delBlog
}
