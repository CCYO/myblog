const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const {get, set} = require('./src/db/redis.js')


//↓應該用不到，用redis取代
//const SESSION_DATA = {
//
//}

const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24*60*60*1000))
    return d.toGMTString()
}

const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        console.log('req.contentType: >' + req.headers['content-type'])
	if(req.method !== "POST"){
	    console.log('app.js----req is not POST')
            return resolve({})
        }
        if(req.headers['content-type'] !== 'application/json; charset=UTF-8'){
	    console.log('app.js----req is not application/json------IS: ' + req.headers['content-type'])
            return resolve({})
        }
        let postData = ''
        req.on('data', (chunk) => {
	    console.log('app.js----req sent data...')
            postData += chunk.toString()
        })
        req.on('end', () => {
            console.log('show postData: ', postData)
            console.log('JSON.parse: ', JSON.parse(postData))
            if(!postData) {
                return resolve({})
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    //設定response格式
    res.setHeader('Content-Type', 'application/json')

    //獲取path
    const url = req.url;
    req.path = url.split('?')[0]
    
    //解析query
    req.query = querystring.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' //格式k1=v1;k2=v2;...
    cookieStr.split(';').forEach(item => {
        if(!item){
            return
        }
        const arr = item.split('=')
        const key = arr[0]
        const val = arr[1]
        req.cookie[key] = val
    })

    //需不需要設定cookie
    let needSetCookie = false
    let userId = req.cookie.userId
    if(!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        req.cookie.userId = userId
    }


    //處理post data
    getPostData(req).then(postData => {
        req.body = postData

        //處理 blog路由
        const blogResult = handleBlogRouter(req, res)
        if(blogResult){
            blogResult.then(blogData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userId=${userId};path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        //處理 user路由
        const userResult = handleUserRouter(req, res)
        if(userResult){
            userResult.then(userData => {
               if(needSetCookie){
                    res.setHeader('Set-Cookie', `userId=${userId};path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }
        
        
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.write('404 Not Found')
        res.end()
    })
}

module.exports = serverHandle
