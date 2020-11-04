const http = require('http'),
      PORT = (process.env.PORT)? process.env.PORT : 8000;

const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT, ()=>{
    console.log(`NodeJS在後台 listen ${PORT} OK`)
})
