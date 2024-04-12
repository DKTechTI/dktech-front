import { SyntheticEvent, useEffect } from 'react'

import { useRouter } from 'next/router'

import { Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button, MenuItem, Box } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

import useGetDataApi from 'src/hooks/useGetDataApi'

import toast from 'react-hot-toast'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'

const schema = yup.object().shape({
  deviceId: yup.string().required('Dispositivo obrigatório'),
  name: yup.string().required('Nome obrigatório'),
  boardId: yup.string().required('ID da placa obrigatório'),
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

interface AddCentralProps {
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const AddCentral = ({ handleClose, open, refresh, setRefresh }: AddCentralProps) => {
  const router = useRouter()

  const { id } = router.query

  const { data: devices } = useGetDataApi<any>({ url: '/devices', callInit: router.isReady && open })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    resetField,
    formState: { errors }
  } = useForm({
    defaultValues: {
      projectId: id ? id : '',
      connection: 'DHCP',
      isCentral: true,
      moduleType: 'INOUT',
      type: 'CENTRAL',
      port: '5000',
      ip: '0',
      gateway: '0',
      subnet: '0',
      dns: '0',
      tcp: '0'
    } as FormData,
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
        resetField('ip')
        resetField('gateway')
        resetField('subnet')
        resetField('dns')
      }

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
      .post('/projectDevices', formData)
      .then(response => {
        if (response.status === 201) {
          handleClose()
          toast.success('Central adicionada com sucesso!')
          setRefresh(!refresh)
        }
      })
      .catch(() => {
        handleClose()
        toast.error('Erro ao adicionar central, tente novamente mais tarde')
      })
  }

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  return (
    <Dialog
      open={open}
      aria-labelledby='user-view-edit'
      aria-describedby='user-view-edit-description'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 1000 } }}
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
        Adicionar Central ao Projeto
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <Grid container spacing={6} justifyContent={'space-between'} pb={6}>
          <Grid item xs={12} sm={6}>
            <Button variant='contained' color='success'>
              Online
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} gap={10}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 2 }}>
              <Button variant='contained' color='primary' startIcon={<IconifyIcon icon='tabler:wifi' />}>
                Testar Conexão
              </Button>
              <Button variant='contained' color='error' startIcon={<IconifyIcon icon='tabler:trash' />}>
                Deletar
              </Button>
            </Box>
          </Grid>
        </Grid>
        <form noValidate autoComplete='off'>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='deviceId'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Central'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.deviceId)}
                    {...(errors.deviceId && { helperText: errors.deviceId.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    {devices?.data.map((device: any) => {
                      if (device.type === 'CENTRAL') {
                        return (
                          <MenuItem key={device._id} value={device._id}>
                            {device.modelName}
                          </MenuItem>
                        )
                      }
                    })}
                  </CustomTextField>
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

            <Grid item xs={12} sm={3}>
              <Controller
                name='boardId'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='ID'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.boardId)}
                    {...(errors.boardId && { helperText: errors.boardId.message })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCentral
