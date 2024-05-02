import React, { createContext, useRef, useState } from 'react'
import equals from 'fast-deep-equal'

import { useProjectMenu } from 'src/hooks/useProjectMenu'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import { api } from 'src/services/api'

type HttpMethod = 'PATCH' | 'PUT' | 'POST'
type refreshTypeValues = 'menu' | 'deviceKeys'

type AutoSaveValuesType = {
  saveState: string
  handleSaveOnStateChange: (
    apiUrl: string,
    storageData: any,
    httpMethod: HttpMethod,
    refreshOn?: refreshTypeValues[]
  ) => Promise<any>
}

const defaultProvider: AutoSaveValuesType = {
  saveState: 'saved',
  handleSaveOnStateChange: () => Promise.resolve()
}

const AutoSaveContext = createContext(defaultProvider)

const AutoSaveProvider = ({ children }: { children: React.ReactNode }) => {
  const [saveState, setSaveState] = useState<string>('saved')

  const { refreshMenu, setRefreshMenu } = useProjectMenu()
  const { refreshDeviceKeys, setRefreshDeviceKeys } = useDeviceKeys()

  const refreshType: { [key in refreshTypeValues]: () => void } = {
    menu: () => setRefreshMenu(!refreshMenu),
    deviceKeys: () => setRefreshDeviceKeys(!refreshDeviceKeys)
  }

  const prevData = useRef<any>({})

  const handleSaveOnStateChange = async (
    apiUrl: string,
    storageData: any,
    httpMethod: HttpMethod,
    refreshOn?: refreshTypeValues[]
  ) => {
    let response = null

    const saveToApi = async () => {
      try {
        setSaveState('saving')
        const savePromise = apiUrl ? saveToApiMethod(apiUrl, storageData, httpMethod) : Promise.resolve()

        if (savePromise && typeof savePromise.then === 'function') {
          const response = await savePromise

          if (refreshOn && refreshOn.length > 0) {
            refreshOn.forEach((refresh: refreshTypeValues) => refreshType[refresh]())
          }

          setSaveState('saved')

          return response
        }
      } catch (error) {
        setSaveState('saved')

        return error
      }
    }

    if (saveState === 'saved' && !equals(prevData.current, storageData)) {
      response = await saveToApi()
    }

    prevData.current = storageData

    return response
  }

  const saveToApiMethod = async (apiUrl: string, storageData: any, httpMethod: HttpMethod) => {
    switch (httpMethod) {
      case 'PATCH':
        return api.patch(apiUrl, storageData)
      case 'PUT':
        return api.put(apiUrl, storageData)
      case 'POST':
        return api.post(apiUrl, storageData)
      default:
        throw new Error('Método HTTP inválido')
    }
  }

  const contextValue: AutoSaveValuesType = {
    saveState,
    handleSaveOnStateChange
  }

  return <AutoSaveContext.Provider value={contextValue}>{children}</AutoSaveContext.Provider>
}

export { AutoSaveProvider, AutoSaveContext }
