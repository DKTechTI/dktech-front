import { useCallback } from 'react'
import toast from 'react-hot-toast'

const useClipboard = () => {
  const copyToClipboard = useCallback((text: string, message?: string) => {
    try {
      navigator.clipboard.writeText(text)
      if (message) toast.success(message)
    } catch (error) {
      toast.error('Erro ao copiar para a área de transferência, tente novamente')
    }
  }, [])

  return { copyToClipboard }
}

export default useClipboard
