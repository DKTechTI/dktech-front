import { createContext, useState, ReactNode } from 'react'
import { Socket } from 'socket.io-client'
import { socketIO } from 'src/services/socketIO'

type SocketIOContextType = {
  socket: Socket | null
  initializeSocket: (url: string) => void
}

const defaultSocketIOContextType: SocketIOContextType = {
  socket: null,
  initializeSocket: () => null
}

const SocketIOContext = createContext(defaultSocketIOContextType)

interface SocketIOProviderProps {
  children: ReactNode
}

const SocketIOProvider = ({ children }: SocketIOProviderProps): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null)

  const initializeSocket = (url: string) => {
    if (url) {
      const newSocket = socketIO(url)
      setSocket(newSocket)
    }
  }

  return <SocketIOContext.Provider value={{ socket, initializeSocket }}>{children}</SocketIOContext.Provider>
}

export { SocketIOProvider, SocketIOContext }
