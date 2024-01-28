"use client"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io,Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode
}

interface SocketContextProps {
    sendMessage : (msg:string)=> any;
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
    const sendMessage:SocketContextProps['sendMessage'] = useCallback((msg)=>{
        // console.log(`The Message is ${msg}`)
        if(socket){
            socket.emit("event:message",{message:msg})
        }
    },[socket])

    useEffect(()=>{
        const _socket = io("http://localhost:8000")
        setSocket(_socket)

        return ()=>{
            _socket.disconnect()
            setSocket(undefined)
        }
    },[])

    return (
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}
