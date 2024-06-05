import { SyntheticEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  DialogActions,
  Button,
  MenuItem
} from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import { checkPortName, checkSequenceIndex } from 'src/utils/project'

import toast from 'react-hot-toast'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'

import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesErrors from 'src/errors/projectDevicesErrors'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  boardIndex: yup.string().required('Porta obrigatória'),
  index: yup.string().required('Sequencia obrigatória'),
  centralId: yup.string().required('Central obrigatória'),
  deviceId: yup.string().required('Dispositivo de entrada obrigatório'),
  environmentId: yup.string().required('Ambiente obrigatório')
})

interface FormData {
  name: string
  projectId: string
  centralId: string
  boardId: string
  boardIndex: string
  type: string
  moduleType: string
  index: number
  deviceId: string
  environmentId: string
}

interface AddInputDeviceProps {
  environmentId: string
  environmentName: string
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const AddInputDevice = ({
  handleClose,
  open,
  refresh,
  setRefresh,
  environmentId,
  environmentName
}: AddInputDeviceProps) => {
  const router = useRouter()

  const { id } = router.query

  const { handleErrorResponse } = useErrorHandling()
  const { handleAvaliableInputPorts } = useProjectMenu()

  const [ports, setPorts] = useState<any[]>([])
  const [devicesAvailable, setDevicesAvailable] = useState<any[]>([])

  const { data: projectDevices } = useGetDataApi<any>({
    url: `/projectDevices/by-project/${id}`,
    callInit: router.isReady && open
  })

  const { data: devices } = useGetDataApi<any>({ url: `/devices`, callInit: router.isReady && open })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      projectId: id ? id : ''
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleSetCentral = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement

    setPorts([])

    if (value) {
      handleAvaliableInputPorts(value).then((response: any[]) => {
        setPorts(response)
      })

      const central = projectDevices.data.filter((device: any) => device.centralId === value)[0]

      setValue('boardId', central.boardId)
      setValue('centralId', value)
      clearErrors('centralId')

      return
    }

    setValue('centralId', value)
    setError('centralId', { type: 'manual', message: 'Central obrigatória' })
  }

  const handleCheckDeviceOptions = (devices: any[]) => {
    const validDevices = devices?.filter(
      device =>
        device.moduleType === 'INPUT' &&
        (device?.keysQuantity <= ports[Number(watch('boardIndex'))]?.keysQuantityAvaliable ||
          device?.inputTotal <= ports[Number(watch('boardIndex'))]?.keysQuantityAvaliable)
    )

    if (validDevices.length === 0) return

    setDevicesAvailable(validDevices)
  }

  const handleSetBoardIndex = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement

    if (value) {
      setValue('boardIndex', value)
      clearErrors('boardIndex')
      handleCheckDeviceOptions(devices?.data)

      return
    }

    setValue('boardIndex', value)
    setError('boardIndex', { type: 'manual', message: 'Porta obrigatória' })
  }

  const handleSetDevice = (event: SyntheticEvent, devices: any) => {
    const { value } = event.target as HTMLInputElement

    if (value) {
      const device = devices.filter((device: any) => device._id === value)[0]

      setValue('deviceId', value)
      setValue('moduleType', device.moduleType)
      setValue('type', device.type)
      clearErrors('deviceId')

      return
    }

    setValue('deviceId', value)
    setError('deviceId', { type: 'manual', message: 'Dispositivo de entrada obrigatório' })
  }

  const handleRenderDeviceOptions = (currentDevicesAvailable: any[]) => {
    if (currentDevicesAvailable.length > 0)
      return currentDevicesAvailable.map(device => (
        <MenuItem key={device._id} value={device._id}>
          {device.modelName}
        </MenuItem>
      ))

    if (getValues('boardIndex'))
      return (
        <MenuItem value='' disabled>
          <em>Nenhum dispositivo disponível</em>
        </MenuItem>
      )

    return null
  }

  const onSubmit = (formData: FormData) => {
    const data = formData

    Object.assign(data, {
      boardIndex: Number(formData.boardIndex),
      index: Number(formData.index),
      isCentral: false,
      voiceActivation: false
    })

    api
      .post('/projectDevices', data)
      .then(response => {
        if (response.status === 201) {
          toast.success('Dispositivo de entrada adicionado com sucesso!')
          setRefresh(!refresh)
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: projectDevicesErrors,
          defaultErrorMessage: 'Erro ao adicionar dispositivo de entrada, tente novamente mais tarde.'
        })
      })
      .finally(() => handleClose())
  }

  useEffect(() => {
    if (!open) {
      setPorts([])
      setDevicesAvailable([])
      reset()
    }

    setValue('environmentId', environmentId)
  }, [environmentId, open, reset, setValue])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Adicionar Dispositivo de Entrada
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Selecione o dispositivo de entrada que deseja adicionar e o ambiente que deseja associar
        </DialogContentText>
        <form noValidate autoComplete='off'>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Controller
                name='centralId'
                control={control}
                render={({ field: { value, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Central'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={e => handleSetCentral(e)}
                    error={Boolean(errors.centralId)}
                    {...(errors.centralId && { helperText: errors.centralId.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>selecione</em>
                    </MenuItem>
                    {projectDevices?.data.map((device: any) => {
                      if (device.type === 'CENTRAL') {
                        return (
                          <MenuItem key={device.centralId} value={device.centralId}>
                            {device.name}
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
                name='boardIndex'
                control={control}
                render={({ field: { value, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Porta'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={e => handleSetBoardIndex(e)}
                    error={Boolean(errors.boardIndex)}
                    {...(errors.boardIndex && { helperText: errors.boardIndex.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>{watch('centralId') ? 'Selecione' : 'Selecione uma central primeiro'}</em>
                    </MenuItem>
                    {ports.length > 0
                      ? ports.map((port: any, index: number) => (
                          <MenuItem key={index} value={port.port} disabled={!port.avaliable}>
                            {checkPortName(Number(port?.port))}
                          </MenuItem>
                        ))
                      : null}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='index'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Sequencia'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.index)}
                    {...(errors.index && { helperText: errors.index.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>{watch('boardIndex') ? 'Selecione' : 'Selecione uma porta primeiro'}</em>
                    </MenuItem>
                    {ports.length > 0 && watch('boardIndex')
                      ? ports[Number(watch('boardIndex'))].sequence.map((sequence: any, index: number) => (
                          <MenuItem key={index} value={sequence.index} disabled={!sequence.avaliable}>
                            {checkSequenceIndex(sequence.index)}
                          </MenuItem>
                        ))
                      : null}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='deviceId'
                control={control}
                render={({ field: { value, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Dispositivo de Entrada'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={e => handleSetDevice(e, devices?.data)}
                    error={Boolean(errors.deviceId)}
                    {...(errors.deviceId && { helperText: errors.deviceId.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>{watch('boardId') ? 'Selecione' : 'Selecione uma porta primeiro'}</em>
                    </MenuItem>
                    {handleRenderDeviceOptions(devicesAvailable)}
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
                    label='Nome do Dispositivo de Entrada'
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

            <Grid item xs={12}>
              <Controller
                name='environmentId'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Ambiente'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.environmentId)}
                    {...(errors.environmentId && { helperText: errors.environmentId.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>selecione</em>
                    </MenuItem>
                    <MenuItem value={environmentId}>{environmentName}</MenuItem>
                  </CustomTextField>
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

export default AddInputDevice
