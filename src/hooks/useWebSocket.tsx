import { useEffect, useState, useRef } from 'react'

interface MessageProps {
  message: string
  date: string
}

interface WebSocketProps {
  url: string | null
}

export const useWebSocket = ({ url }: WebSocketProps) => {
  const [readyState, setReadyState] = useState<number | null>(null)
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [error, setError] = useState<string | null>(null)

  const ws = useRef<WebSocket | null>(null)

  const handleClearMessages = () => setMessages([])

  useEffect(() => {
    if (!url) return

    const socket = new WebSocket(url)

    socket.onopen = () => {
      setError(null)
      setReadyState(socket.readyState)
    }

    socket.onclose = () => setReadyState(socket.readyState)

    socket.onerror = () => {
      setReadyState(socket.readyState)
      setError('Erro ao conectar a central.')
    }

    socket.onmessage = event =>
      setMessages(prevState => [
        ...prevState,
        {
          message: event.data,
          date: new Date().toISOString()
        }
      ])

    ws.current = socket

    return () => {
      socket.close()
    }
  }, [url])

  return { readyState, messages, error, ws: ws.current, handleClearMessages }
}
