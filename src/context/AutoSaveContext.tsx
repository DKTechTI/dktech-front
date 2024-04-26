import React, { createContext, useEffect, useRef, useState } from 'react'
import equals from 'fast-deep-equal'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'

type HttpMethod = 'PATCH' | 'PUT' | 'POST'

type autoSaveValuesType = {
  saveState: string
  setStorageData: (data: any) => void
  setApiUrl: (url: string | null) => void
  setHttpMethod: (method: HttpMethod) => void
}

const defaultProvider: autoSaveValuesType = {
  saveState: 'saved',
  setStorageData: () => null,
  setApiUrl: () => null,
  setHttpMethod: () => null
}

const AutoSaveContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const AutoSaveProvider = ({ children }: Props) => {
  const [saveState, setSaveState] = useState<string>('saved')
  const [storageData, setStorageData] = useState<any>({})
  const [apiUrl, setApiUrl] = useState<string | null>(null)
  const [httpMethod, setHttpMethod] = useState<HttpMethod>('POST')

  const prevData = useRef<any>({})

  useEffect(() => {
    if (saveState === 'saved' && !equals(prevData.current, storageData)) {
      setSaveState('waitingToSave')
    }
    prevData.current = storageData
  }, [saveState, storageData])

  useEffect(() => {
    const handleSaveOnStateChange = () => {
      if (saveState === 'waitingToSave') {
        const timeoutId = setTimeout(() => {
          setSaveState('saving')
          const savePromise = apiUrl ? saveToApi(storageData) : Promise.resolve()

          if (savePromise && typeof savePromise.then === 'function') {
            savePromise
              .then(() => {
                setSaveState('saved')
                toast.success('Salvo com sucesso!')
              })
              .catch(() => {
                setSaveState('saved')
                toast.error('Erro ao salvar, tente novamente mais tarde!')
              })
          }
        }, 0)

        return () => {
          clearTimeout(timeoutId)
        }
      }
    }

    handleSaveOnStateChange()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState])

  const saveToApi = (data: any) => {
    switch (httpMethod) {
      case 'PATCH':
        return api.patch(apiUrl!, data)
      case 'PUT':
        return api.put(apiUrl!, data)
      case 'POST':
        return api.post(apiUrl!, data)
      default:
        throw new Error('Método HTTP inválido')
    }
  }

  const contextValue: autoSaveValuesType = {
    saveState,
    setHttpMethod,
    setStorageData,
    setApiUrl
  }

  return <AutoSaveContext.Provider value={contextValue}>{children}</AutoSaveContext.Provider>
}

export { AutoSaveProvider, AutoSaveContext }
