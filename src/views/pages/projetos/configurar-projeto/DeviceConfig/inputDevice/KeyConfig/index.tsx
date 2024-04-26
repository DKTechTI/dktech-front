import { Box, CircularProgress, Typography } from '@mui/material'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import KeypadKeyConfig from '../Keypad/Keys/Config'
import ModuleKeyConfig from '../Module/Keys/Config'

const KeyConfig = () => {
  const { keyId, projectDeviceType } = useDeviceKeys()

  const { data: keyData, loading } = useGetDataApi<any>({
    url: `/projectDeviceKeys/${keyId}`,
    callInit: Boolean(keyId)
  })

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '8.75rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant='h4'>Carregando...</Typography>
        </Box>
      </Box>
    )
  }

  if (keyId && keyData?.data && projectDeviceType) {
    return projectDeviceType === 'MODULE' ? (
      <ModuleKeyConfig keyData={keyData.data} />
    ) : (
      <KeypadKeyConfig keyData={keyData.data} />
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
      <Typography variant='h5'>Escolha uma tecla para configurar</Typography>
    </Box>
  )
}

export default KeyConfig
