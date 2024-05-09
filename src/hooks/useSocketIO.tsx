import { useContext } from 'react'
import { SocketIOContext } from 'src/context/SocketIOContext'

export const useSocketIO = () => useContext(SocketIOContext)
