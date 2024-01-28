import {Server} from "socket.io"


class SocketService{
    private _io:Server;
    constructor(){
        this._io  = new Server({
            cors:{
                allowedHeaders:["*"],
                origin:"*"
            }
        })
    }
    get io(){
        const io = this._io
        return io
    }
    
    public initConnection(){
        const io = this._io
        io.on('connect',(socket)=>{
            console.log(`New Connection ${socket.id}`)
            socket.on("event:message",async({message}:{message:string})=>{
                console.log(`New message ${message}`)
            })
        })
    }
}

export default SocketService