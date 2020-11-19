const http = require('http'),
      PORT = process.env.PORT;

const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT, "0.0.0.0", ()=>{
    console.log(`NodeJS在後台 listen ${PORT} OK`)
})
