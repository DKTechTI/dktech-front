import { useState } from 'react'
import { Box, Button, Chip, IconButton, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import Edit from './Edit'
import Monitoring from './Monitoring'

interface HeaderProjectProps {
  data: any
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const HeaderProject = ({ data, refresh, setRefresh }: HeaderProjectProps) => {
  const [open, setOpen] = useState(false)
  const [openMonitoring, setOpenMonitoring] = useState(false)

  return (
    <>
      <Edit data={data} open={open} handleClose={() => setOpen(false)} refresh={refresh} setRefresh={setRefresh} />
      <Monitoring open={openMonitoring} handleClose={() => setOpenMonitoring(false)} />

      <Box
        sx={{
          width: '100%',
          padding: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Typography variant='h5' component='h2' sx={{ width: 'fit-content', fontWeight: 700 }}>
          {data.clientName}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Button title={data.name}>
            <Chip
              label={data.name}
              onClick={() => setOpen(true)}
              sx={{
                width: '8rem',
                height: '2rem',
                fontSize: 'medium'
              }}
            />
          </Button>
          <IconButton title='Monitoramento' onClick={() => setOpenMonitoring(true)}>
            <IconifyIcon icon='tabler:eye-pin' />
          </IconButton>
        </Box>
        <Button
          variant='contained'
          size='medium'
          sx={{
            width: {
              xs: '100%',
              sm: '100%',
              md: 'auto'
            }
          }}
        >
          Configurar Projeto
        </Button>
      </Box>
    </>
  )
}

export default HeaderProject
