import { useState } from 'react'
import { Box, Button, Chip, IconButton, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import Edit from './Edit'
import Monitoring from './Monitoring'
import BackdropConfig from '../DeviceConfig/BackdropConfig'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'

interface HeaderProjectProps {
  data: any
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const HeaderProject = ({ data, refresh, setRefresh }: HeaderProjectProps) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [openMonitoring, setOpenMonitoring] = useState(false)
  const [finished, setFinished] = useState(false)
  const [success, setSuccess] = useState(false)

  const hamdleConfigProject = (projectId: string) => {
    setOpenBackdrop(true)
    setSuccess(false)

    api
      .post(`projects/send-config/${projectId}`)
      .then(() => {
        setSuccess(true)
      })
      .catch(() => {
        toast.error('Erro ao enviar configuração')
      })
      .finally(() => {
        setFinished(true)

        setTimeout(() => {
          setOpenBackdrop(false)
          setRefresh(!refresh)
          setFinished(false)
        }, 5000)
      })
  }

  return (
    <>
      <Edit
        data={data}
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <Monitoring open={openMonitoring} handleClose={() => setOpenMonitoring(false)} />
      <BackdropConfig open={openBackdrop} finished={finished} success={success} />

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
              onClick={() => setOpenEdit(true)}
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
          onClick={() => hamdleConfigProject(data._id)}
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
