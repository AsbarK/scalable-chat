import {Server} from "socket.io"
import Redis from "ioredis"

const pub = new Redis({
    host:process.env.REDIS_HOST!,
    port:Number(process.env.REDIS_PORT!),
    username:process.env.REDIS_USERNAME!,
    password:process.env.REDIS_PASSWORD!
})
const sub = new Redis({
    host:process.env.REDIS_HOST,
    port:Number(process.env.REDIS_PORT),
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD
})



class SocketService{
    private _io:Server;
    constructor(){
        sub.subscribe("MESSAGES")
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
                await pub.publish("MESSAGES",JSON.stringify({message:message}))
            })
        })
        sub.on("message",(channel,message)=>{
            if(channel === "MESSAGES"){
                io.emit("message",message)
            }
        })
    }
}

export default SocketService