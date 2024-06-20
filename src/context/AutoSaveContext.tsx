import React, { createContext, useRef, useState } from 'react'
import equals from 'fast-deep-equal'

import { useProjectMenu } from 'src/hooks/useProjectMenu'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import { api } from 'src/services/api'

type HttpMethod = 'PATCH' | 'PUT' | 'POST'
type refreshTypeValues = 'menu' | 'deviceKeys'
type handleSaveOnStateChangeType = {
  apiUrl: string
  storageData: any
  httpMethod: HttpMethod
  autoCheck?: boolean
  refreshOn?: refreshTypeValues[]
}

type AutoSaveValuesType = {
  saveState: string
  handleSaveOnStateChange: ({
    apiUrl,
    httpMethod,
    storageData,
    autoCheck,
    refreshOn
  }: handleSaveOnStateChangeType) => Promise<any>
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

  const handleSaveOnStateChange = async ({
    apiUrl,
    httpMethod,
    storageData,
    autoCheck = true,
    refreshOn
  }: handleSaveOnStateChangeType) => {
    if (saveState === 'saved') {
      if (autoCheck && equals(storageData, prevData.current)) return null

      const savePromise = apiUrl ? saveToApiMethod(apiUrl, storageData, httpMethod) : Promise.resolve()

      if (savePromise && typeof savePromise.then === 'function') {
        setSaveState('saving')

        try {
          const response = await savePromise

          if (refreshOn && refreshOn.length > 0)
            refreshOn.forEach((refresh: refreshTypeValues) => refreshType[refresh]())

          prevData.current = { ...storageData }

          return response
        } catch (error) {
          prevData.current = {}
          throw error
        } finally {
          setSaveState('saved')
        }
      }
    }
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
