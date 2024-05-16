import { SyntheticEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Button,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton
} from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import DeleteDevice from './Delete'

import useClipboard from 'src/hooks/useClipboard'
import useGetDataApi from 'src/hooks/useGetDataApi'

import toast from 'react-hot-toast'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'

import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesErrors from 'src/errors/projectDevicesErrors'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  connection: yup.string().required('Conexão obrigatória'),
  ip: yup.string().when('connection', ([connection], schema) => {
    return connection === 'STATIC_IP' ? schema.required('IP obrigatório') : schema.notRequired()
  }),
  gateway: yup.string().when('connection', ([connection], schema) => {
    return connection === 'STATIC_IP' ? schema.required('Gateway obrigatório') : schema.notRequired()
  }),
  subnet: yup.string().when('connection', ([connection], schema) => {
    return connection === 'STATIC_IP' ? schema.required('Subnet obrigatório') : schema.notRequired()
  }),
  dns: yup.string().when('connection', ([connection], schema) => {
    return connection === 'STATIC_IP' ? schema.required('DNS obrigatório') : schema.notRequired()
  }),
  tcp: yup.string().when('connection', ([connection], schema) => {
    return connection === 'STATIC_IP' ? schema.required('DNS obrigatório') : schema.notRequired()
  }),
  port: yup.string().required('Porta obrigatória')
})

interface FormData {
  deviceId: string
  name: string
  projectId: string
  boardId: string
  connection?: string
  isCentral: boolean
  moduleType: string
  type: string
  ip: string
  gateway: string
  subnet: string
  dns: string
  port: string
  tcp: string
}

interface CentralStatusType {
  [key: string]: string
}

const centralStatusObj: CentralStatusType = {
  online: '#28C76F',
  offline: '#EA5455'
}

interface EditCentralProps {
  projectDeviceId: string
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const EditCentral = ({ handleClose, open, refresh, setRefresh, projectDeviceId }: EditCentralProps) => {
  const router = useRouter()
  const { copyToClipboard } = useClipboard()
  const { handleErrorResponse } = useErrorHandling()

  const { data: projectDevice } = useGetDataApi<any>({
    url: `/projectDevices/${projectDeviceId}`,
    callInit: router.isReady && open
  })

  const [deleteDialogOpen, setDeletedDialogOpen] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {} as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleCheckConnectionType = (connection: string) => {
    return connection === 'STATIC_IP' ? false : true
  }

  const handleChangeConnectionType = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement

    setValue('connection', value)

    if (value) {
      clearErrors('connection')

      if (value === 'DHCP') {
        setValue('ip', '0')
        setValue('gateway', '0')
        setValue('subnet', '0')
        setValue('dns', '0')
        setValue('tcp', '0')

        return
      }

      setValue('ip', projectDevice?.data.ip)
      setValue('gateway', projectDevice?.data.gateway)
      setValue('subnet', projectDevice?.data.subnet)
      setValue('dns', projectDevice?.data.dns)
      setValue('tcp', projectDevice?.data.tcp)

      return
    }

    setError('connection', {
      type: 'manual',
      message: 'Conexão obrigatória'
    })
  }

  const onSubmit = (formData: FormData) => {
    const data = formData

    Object.assign(data, {
      dhcp: formData.connection === 'DHCP'
    })

    delete data['connection']

    api
      .put(`/projectDevices/${projectDevice?.data._id}`, formData)
      .then(response => {
        if (response.status === 200) {
          handleClose()
          toast.success('Dados atualizados com sucesso!')
          setRefresh(!refresh)
        }
      })
      .catch(error => {
        handleClose()
        handleErrorResponse({
          error: error,
          errorReference: projectDevicesErrors,
          defaultErrorMessage: 'Erro ao atualizar os dados, tente novamente mais tarde.'
        })
      })
  }

  useEffect(() => {
    if (!open) {
      reset()
    }

    if (projectDevice?.data) {
      reset({
        projectId: projectDevice?.data.projectId,
        deviceId: projectDevice?.data.deviceId,
        name: projectDevice?.data.name,
        boardId: projectDevice?.data.boardId,
        connection: projectDevice?.data.dhcp ? 'DHCP' : 'STATIC_IP',
        ip: projectDevice?.data.ip,
        gateway: projectDevice?.data.gateway,
        subnet: projectDevice?.data.subnet,
        dns: projectDevice?.data.dns,
        tcp: projectDevice?.data.tcp,
        port: projectDevice?.data.port
      })
    }
  }, [open, reset, projectDevice])

  if (!projectDevice) {
    return null
  }

  return (
    <>
      <DeleteDevice
        id={projectDeviceId}
        question='Deseja deletar esta central?'
        description='Os dispositivos ou teclas vinculados serão deletados, deseja continuar? Esta ação não poderá ser desfeita!'
        open={deleteDialogOpen}
        setOpen={setDeletedDialogOpen}
        handleClose={handleClose}
      />

      <Dialog
        open={open}
        aria-labelledby='user-view-edit'
        aria-describedby='user-view-edit-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 750 } }}
      >
        <DialogTitle
          id='user-view-edit'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          Editar Central
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Grid container spacing={6} justifyContent={'space-between'} pb={6}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Chip
                  icon={<IconifyIcon icon='tabler:circle-filled' color={centralStatusObj['online']} />}
                  label={'Online'}
                  variant='outlined'
                  deleteIcon={<IconifyIcon icon='tabler:refresh' />}
                  onDelete={() => console.log('refresh')}
                  sx={{
                    width: 'fit-content',
                    color: '#d0d4f1c7',
                    '& .MuiChip-deleteIcon': {
                      color: '#d0d4f1c7',
                      ':hover': {
                        opacity: 0.9,
                        transition: '0.1s'
                      }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant='h4' sx={{ color: 'text.primaty' }}>
                    # {watch('boardId')}
                  </Typography>

                  <IconButton onClick={() => copyToClipboard(watch('boardId'))}>
                    <IconifyIcon icon='tabler:copy' color={centralStatusObj['online']} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} gap={10}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 2 }}>
                <Button
                  variant='contained'
                  color='error'
                  startIcon={<IconifyIcon icon='tabler:trash' />}
                  onClick={() => setDeletedDialogOpen(true)}
                >
                  Deletar
                </Button>
              </Box>
            </Grid>
          </Grid>
          <form noValidate autoComplete='off'>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Nome'
                      required
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.name)}
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='connection'
                  control={control}
                  render={({ field: { value, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Conexão'
                      required
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={e => handleChangeConnectionType(e)}
                      error={Boolean(errors.connection)}
                      {...(errors.connection && { helperText: errors.connection.message })}
                    >
                      <MenuItem value=''>
                        <em>selecione</em>
                      </MenuItem>
                      <MenuItem value='DHCP'>DHCP</MenuItem>
                      <MenuItem value='STATIC_IP'>IP Estático</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='ip'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='IP'
                      disabled={handleCheckConnectionType(watch('connection') as string)}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.ip)}
                      {...(errors.ip && { helperText: errors.ip.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='port'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Porta'
                      required
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.port)}
                      {...(errors.port && { helperText: errors.port.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='subnet'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Subnet'
                      disabled={handleCheckConnectionType(watch('connection') as string)}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.subnet)}
                      {...(errors.subnet && { helperText: errors.subnet.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='dns'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='DNS'
                      disabled={handleCheckConnectionType(watch('connection') as string)}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.dns)}
                      {...(errors.dns && { helperText: errors.dns.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='tcp'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='TCP'
                      disabled={handleCheckConnectionType(watch('connection') as string)}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.tcp)}
                      {...(errors.tcp && { helperText: errors.tcp.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='gateway'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Gateway'
                      disabled={handleCheckConnectionType(watch('connection') as string)}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.gateway)}
                      {...(errors.gateway && { helperText: errors.gateway.message })}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditCentral
