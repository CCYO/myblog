const http = require('http'),
      PORT = 8000;

const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT, ()=>{
    console.log("listen OK")
})
