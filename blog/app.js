const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog"),
      handleUserRouter = require("./src/router/user"),
      { set } = require("./src/db/redis.js");

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

//解析POST Data
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      return resolve({});
    }
    if (req.headers["content-type"] !== "application/json") {
      return resolve({});
    }
    
    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        return resolve({});
      }
      resolve(JSON.parse(postData));
    });
  });
};

//解析Session
getSession = (req) => {
  return promise = get(req);
};

const serverHandle = (req, res) => {
  //設定response格式
  res.setHeader("Content-Type", "application/json");

  //解析path
  const url = req.url;
  req.path = url.split("?")[0];

  //解析query
  req.query = querystring.parse(url.split("?")[1]);

  //解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ""; //格式k1=v1;k2=v2;...
  cookieStr.split(";").forEach((item) => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0];
    const val = arr[1];
    req.cookie[key] = val;
  });

  //解析cookie.userId
  let needSetCookie = false;
  if (!req.cookie.userId) {
    needSetCookie = true;
    req.cookie.userId = `${Date.now()}_${Math.random()}`;
  }

  
  Promise.all([getPostData(req), getSession(req.cookie.userId)])
    .then((resultArr) => {
      req.body = resultArr[0];
      req.session = resultArr[1];
    
      //處理 blog路由
      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then((blogData) => {
          if (needSetCookie) {
            res.setHeader( "Set-Cookie",`userId=${req.cookie.userId};path=/; httpOnly; expires=${getCookieExpires()}`);
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }
    
      //處理 user路由
      const userResult = handleUserRouter(req, res);
      if (userResult) {
        userResult.then((userData) => {
          if (needSetCookie) {
            res.setHeader("Set-Cookie",`userId=${req.cookie.userId};path=/; httpOnly; expires=${getCookieExpires()}`);
          }
          res.end(JSON.stringify(userData));
        });
        return;
      }
      
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 Not Found");
      res.end();
    });
};

module.exports = serverHandle;
