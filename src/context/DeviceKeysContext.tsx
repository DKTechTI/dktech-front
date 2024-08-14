import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo, useState } from 'react'
import useGetDataApi from 'src/hooks/useGetDataApi'

type deviceKeysValuesType = {
  deviceKeys: null | any
  setOrderKeys: (value: any) => void
  keyId: null | string
  setKeyId: (value: string | null) => void
  keyType: null | string
  setKeyType: (value: string | null) => void
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
  keyType: null,
  setKeyType: () => null,
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

  const [keyId, setKeyId] = useState<string | null>(null)
  const [keyType, setKeyType] = useState<string | null>(null)
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

  const memoizedValues = useMemo(
    () => ({
      deviceKeys,
      setOrderKeys,
      keyId,
      setKeyId,
      keyType,
      setKeyType,
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
    }),
    [
      deviceId,
      deviceKeys,
      environmentId,
      keyId,
      keyType,
      loadingDeviceKeys,
      projectDeviceId,
      projectDeviceModuleType,
      projectDeviceType,
      refreshDeviceKeys,
      setRefreshDeviceKeys
    ]
  )

  return <DeviceKeysContext.Provider value={memoizedValues}>{children}</DeviceKeysContext.Provider>
}

export { DeviceKeysProvider, DeviceKeysContext }
