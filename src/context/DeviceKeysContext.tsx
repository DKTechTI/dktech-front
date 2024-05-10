import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import useGetDataApi from 'src/hooks/useGetDataApi'

type deviceKeysValuesType = {
  deviceKeys: null | any
  setOrderKeys: (value: any) => void
  keyId: null | any
  setKeyId: (value: any) => void
  projectDeviceId: null | any
  setProjectDeviceId: (value: any) => void
  projectDeviceType: null | string
  setProjectDeviceType: (value: string | null) => void
  projectDeviceModuleType: null | string
  setProjectDeviceModuleType: (value: string | null) => void
  deviceId: null | any
  setDeviceId: (value: any) => void
  environmentId: null | any
  setEnvironmentId: (value: any) => void
  loadingDeviceKeys: boolean
  refreshDeviceKeys: boolean
  setRefreshDeviceKeys: (value: boolean) => void
}

const defaultDeviceKeysProvider: deviceKeysValuesType = {
  deviceKeys: null,
  setOrderKeys: () => null,
  keyId: null,
  setKeyId: () => null,
  projectDeviceId: null,
  setProjectDeviceId: () => null,
  projectDeviceType: null,
  setProjectDeviceType: () => null,
  projectDeviceModuleType: null,
  setProjectDeviceModuleType: () => null,
  deviceId: null,
  setDeviceId: () => null,
  environmentId: null,
  setEnvironmentId: () => null,
  loadingDeviceKeys: true,
  refreshDeviceKeys: false,
  setRefreshDeviceKeys: () => Boolean
}

const DeviceKeysContext = createContext(defaultDeviceKeysProvider)

type Props = {
  children: React.ReactNode
}

const DeviceKeysProvider = ({ children }: Props) => {
  const router = useRouter()

  const { id: projectId } = router.query

  const [keyId, setKeyId] = useState('')
  const [projectDeviceId, setProjectDeviceId] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [deviceKeys, setDeviceKeys] = useState<any[]>([])
  const [orderKeys, setOrderKeys] = useState<any>(null)
  const [projectDeviceType, setProjectDeviceType] = useState<string | null>(null)
  const [projectDeviceModuleType, setProjectDeviceModuleType] = useState<string | null>(null)
  const [environmentId, setEnvironmentId] = useState('')

  const {
    data,
    loading: loadingDeviceKeys,
    refresh: refreshDeviceKeys,
    setRefresh: setRefreshDeviceKeys
  } = useGetDataApi<any>({
    url: `/projectDeviceKeys/by-project/${projectId}`,
    params: {
      projectDeviceId: projectDeviceId
    },
    callInit: Boolean(projectId) && Boolean(projectDeviceId)
  })

  useEffect(() => {
    if (!projectDeviceId) return setDeviceKeys([])

    if (data?.data && data.data.length > 0) {
      const arrayActions = data.data

      if (orderKeys) {
        const idToIndexMap: { [key: string]: number } = {}

        Object.entries(orderKeys).forEach(([index, id]) => {
          idToIndexMap[id as string] = parseInt(index as string)
        })

        arrayActions.sort((a: any, b: any) => idToIndexMap[a._id] - idToIndexMap[b._id])
      }

      return setDeviceKeys(arrayActions)
    }

    setDeviceKeys([])
  }, [data, orderKeys, projectDeviceId])

  return (
    <DeviceKeysContext.Provider
      value={{
        deviceKeys,
        setOrderKeys,
        keyId,
        setKeyId,
        projectDeviceId,
        setProjectDeviceId,
        projectDeviceType,
        setProjectDeviceType,
        projectDeviceModuleType,
        setProjectDeviceModuleType,
        deviceId,
        setDeviceId,
        environmentId,
        setEnvironmentId,
        loadingDeviceKeys,
        refreshDeviceKeys,
        setRefreshDeviceKeys
      }}
    >
      {children}
    </DeviceKeysContext.Provider>
  )
}

export { DeviceKeysProvider, DeviceKeysContext }
