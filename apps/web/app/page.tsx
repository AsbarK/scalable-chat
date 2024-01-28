"use client"

import { useState } from "react"
import { useSocket } from "../services/socketProvider"

export default function Home(){
  const [msg,setMsg] = useState('')
  const {sendMessage,messages} = useSocket()
  
  return (
    <>
    <input type="text" className="w-4 p-1" placeholder="Type the message" onChange={(e)=>setMsg(e.target.value)} value={msg} />
    <button onClick={()=>sendMessage(msg)}>send</button>
    <div>
      {messages.map((item,ind)=>(<li key={ind}>{item}</li>))}
    </div>
    </>
  )
}