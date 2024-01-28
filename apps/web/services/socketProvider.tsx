"use client"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io,Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode
}

interface SocketContextProps {
    sendMessage : (msg:string)=> any;
    messages:string[]
}

const SocketContext = React.createContext<SocketContextProps|null>(null)

export const useSocket = ()=>{
    const state = useContext(SocketContext)
    if(!state){
        throw new Error("NO STATE!")
    }
    return state;
}

export const SocketProvider : React.FC<SocketProviderProps> = ({children})=>{
    const [socket,setSocket] = useState<Socket>()
    const [messages,setMessages] = useState<string[]>([])
    const sendMessage:SocketContextProps['sendMessage'] = useCallback((msg)=>{
        // console.log(`The Message is ${msg}`)
        if(socket){
            socket.emit("event:message",{message:msg})
        }
    },[socket])
    const onMessage = useCallback((msg:string)=>{
        const {message} = JSON.parse(msg) as {message:string}
        setMessages((prev)=>[...prev,message])
    },[])

    useEffect(()=>{
        const _socket = io("http://localhost:8000")
        _socket.on("message",onMessage)
        setSocket(_socket)

        return ()=>{
            _socket.disconnect()
            _socket.off("message",onMessage)
            setSocket(undefined)
        }
    },[])

    return (
        <SocketContext.Provider value={{sendMessage,messages}}>
            {children}
        </SocketContext.Provider>
    )
}
