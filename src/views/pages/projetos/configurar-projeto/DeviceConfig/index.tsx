import { useRouter } from 'next/router'
import useGetDataApi from 'src/hooks/useGetDataApi'
import Module from './Module'
import { Box, CircularProgress, Typography } from '@mui/material'
import Keypad from './Keypad'

interface DeviceConfigProps {
  projectDeviceId: string
}

const DeviceConfig = ({ projectDeviceId }: DeviceConfigProps) => {
  const router = useRouter()

  const { data, loading, refresh, setRefresh } = useGetDataApi<any>({
    url: `/projectDevices/${projectDeviceId}`,
    callInit: Boolean(projectDeviceId && router.isReady)
  })

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

  if (projectDeviceId && data) {
    return data.data.type === 'MODULE' ? (
      <Module deviceData={data.data} refresh={refresh} setRefresh={setRefresh} />
    ) : (
      <Keypad deviceData={data.data} refresh={refresh} setRefresh={setRefresh} />
    )
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
