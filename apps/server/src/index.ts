import http from "http"
import SocketService from "./services/socket"

async function init(){
    const httpServer = http.createServer()
    const PORT = process.env.PORT ? process.env.PORT : 8000
    const socket = new SocketService()

    socket.io.attach(httpServer)

    httpServer.listen(PORT,()=>{
        console.log(`http server listening on PORT:${PORT}`)
    })

    socket.initConnection()
}

init()