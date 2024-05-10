import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { Box, CircularProgress, Typography } from '@mui/material'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import Module from './inputDevice/Module'
import Keypad from './inputDevice/Keypad'
import ModuleOutput from './outputDevice/Module'

interface DeviceConfigProps {
  projectDeviceId: string
}

const DeviceConfig = ({ projectDeviceId }: DeviceConfigProps) => {
  const router = useRouter()

  const { setProjectDeviceType, setProjectDeviceModuleType, setOrderKeys } = useDeviceKeys()

  const { data, loading, refresh, setRefresh } = useGetDataApi<any>({
    url: `/projectDevices/${projectDeviceId}`,
    callInit: Boolean(projectDeviceId && router.isReady)
  })

  useEffect(() => {
    if (data?.data) {
      setProjectDeviceType(data.data.type)
      setProjectDeviceModuleType(data.data.moduleType)
      setOrderKeys(data.data.indexDeviceKeys)
    }
  }, [data, setOrderKeys, setProjectDeviceModuleType, setProjectDeviceType])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6rem 1rem' }}>
          <CircularProgress />
          <Typography variant='h4'>Carregando...</Typography>
        </Box>
      </Box>
    )
  }

  if (projectDeviceId && data?.data) {
    if (data.data.moduleType === 'INPUT') {
      const isModule = data.data.type === 'MODULE'

      return isModule ? (
        <Module deviceData={data.data} refresh={refresh} setRefresh={setRefresh} />
      ) : (
        <Keypad deviceData={data.data} refresh={refresh} setRefresh={setRefresh} />
      )
    }

    if (data.data.moduleType === 'OUTPUT') {
      return <ModuleOutput deviceData={data.data} refresh={refresh} setRefresh={setRefresh} />
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        padding: '6rem 1rem'
      }}
    >
      <Typography variant='h5'>Escolha um dispositivo para configurar</Typography>
    </Box>
  )
}

export default DeviceConfig
