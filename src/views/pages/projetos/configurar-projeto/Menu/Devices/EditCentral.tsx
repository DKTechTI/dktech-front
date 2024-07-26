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
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import DeleteDevice from './Delete'

import useClipboard from 'src/hooks/useClipboard'
import useGetDataApi from 'src/hooks/useGetDataApi'

import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'

import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesErrors from 'src/errors/projectDevicesErrors'
import { delay } from 'src/utils/delay'
import { applyIPMask } from 'src/utils/inputs'

const schema = yup.object().shape({
  boardId: yup.string().required('Board ID obrigatório'),
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
}

interface CentralStatusType {
  [key: string]: string
}

const centralStatusObj: CentralStatusType = {
  true: '#28C76F',
  false: '#EA5455'
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

  const [deleteDialogOpen, setDeletedDialogOpen] = useState<boolean>(false)

  const [online, setOnline] = useState(false)

  const [loadingCentralStatus, setLoadingCentralStatus] = useState(false)
  const [refreshCentralStatus, setRefreshCentralStatus] = useState(false)

  const { data: projectDevice, loading } = useGetDataApi<any>({
    url: `/projectDevices/${projectDeviceId}`,
    callInit: router.isReady && open
  })

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

        return
      }

      setValue('ip', applyIPMask((projectDevice?.data.ip as string) || ''))
      setValue('gateway', applyIPMask((projectDevice?.data.gateway as string) || ''))
      setValue('subnet', applyIPMask((projectDevice?.data.subnet as string) || ''))
      setValue('dns', applyIPMask((projectDevice?.data.dns as string) || ''))

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
      setValue('projectId', '')
      setValue('deviceId', '')
      setValue('name', '')
      setValue('boardId', '')
      setValue('connection', '')
      setValue('ip', '')
      setValue('gateway', '')
      setValue('subnet', '')
      setValue('dns', '')
      setValue('port', '')
      delay(200).then(() => online && setOnline(false))
    }
  }, [online, open, reset, setValue])

  useEffect(() => {
    if (projectDevice?.data) {
      setValue('projectId', projectDevice?.data.projectId)
      setValue('deviceId', projectDevice?.data.deviceId)
      setValue('name', projectDevice?.data.name)
      setValue('boardId', projectDevice?.data.boardId)
      setValue('connection', projectDevice?.data.dhcp ? 'DHCP' : 'STATIC_IP')
      setValue('ip', applyIPMask(projectDevice?.data.ip))
      setValue('gateway', applyIPMask(projectDevice?.data.gateway))
      setValue('subnet', applyIPMask(projectDevice?.data.subnet))
      setValue('dns', applyIPMask(projectDevice?.data.dns))
      setValue('port', projectDevice?.data.port)
    }
  }, [projectDevice, setValue])

  useEffect(() => {
    if (projectDevice?.data && open) {
      setLoadingCentralStatus(true)

      const controllerApi = new AbortController()

      api
        .get(`/mqtt/device-status`, {
          signal: controllerApi.signal,
          params: { boardId: projectDevice?.data.boardId, projectId: projectDevice?.data.projectId }
        })
        .then(response => {
          setOnline(response.data)
        })
        .catch((error: any) => {
          const responseError: { [key: string]: string } = {
            ERR_CANCELED: 'Requisição cancelada'
          }
          !responseError[error.code] && toast.error('Erro ao buscar status da central, tente novamente mais tarde.')
        })
        .finally(() => setLoadingCentralStatus(false))

      const closeDialog = document.getElementById('closeDialog')

      closeDialog?.addEventListener('click', () => {
        controllerApi.abort()
      })

      const interval = setInterval(() => {
        setRefreshCentralStatus(!refreshCentralStatus)
      }, 5000)

      return () => {
        clearInterval(interval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCentralStatus, projectDevice?.data])

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
              <AnimatePresence>
                <Chip
                  icon={<IconifyIcon icon='tabler:circle-filled' color={centralStatusObj[String(online)]} />}
                  label={online ? 'Online' : 'Offline'}
                  variant='outlined'
                  deleteIcon={
                    loadingCentralStatus ? (
                      <motion.div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                      >
                        <IconifyIcon icon='tabler:refresh' />
                      </motion.div>
                    ) : (
                      <IconifyIcon icon='tabler:refresh' />
                    )
                  }
                  onDelete={() => setRefreshCentralStatus(current => !current)}
                  disabled={loadingCentralStatus}
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
              </AnimatePresence>
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
          {loading ? (
            <Box display='flex' justifyContent='center' alignItems='center' p={30}>
              <CircularProgress />
            </Box>
          ) : (
            <form noValidate autoComplete='off'>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='boardId'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Board ID'
                        required
                        value={value || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.boardId)}
                        {...(errors.boardId && { helperText: errors.boardId.message })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={() => copyToClipboard(watch('boardId'))}>
                                <IconifyIcon icon='tabler:copy' color={centralStatusObj['online']} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
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
                        <MenuItem disabled>
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
                        onChange={e => onChange(applyIPMask(e.target.value))}
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
                        onChange={e => onChange(applyIPMask(e.target.value))}
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
                        onChange={e => onChange(applyIPMask(e.target.value))}
                        error={Boolean(errors.dns)}
                        {...(errors.dns && { helperText: errors.dns.message })}
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
                        onChange={e => onChange(applyIPMask(e.target.value))}
                        error={Boolean(errors.gateway)}
                        {...(errors.gateway && { helperText: errors.gateway.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button id='closeDialog' variant='tonal' color='secondary' onClick={handleClose}>
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
