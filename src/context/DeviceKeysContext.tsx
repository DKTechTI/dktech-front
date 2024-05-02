import { useRouter } from 'next/router'
import { createContext, useState } from 'react'
import useGetDataApi from 'src/hooks/useGetDataApi'

type deviceKeysValuesType = {
  deviceKeys: null | any
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
  const [projectDeviceType, setProjectDeviceType] = useState<string | null>(null)
  const [projectDeviceModuleType, setProjectDeviceModuleType] = useState<string | null>(null)
  const [environmentId, setEnvironmentId] = useState('')

  const {
    data: deviceKeys,
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

  return (
    <DeviceKeysContext.Provider
      value={{
        deviceKeys,
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
