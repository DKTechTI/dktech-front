import { memo, SyntheticEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  DialogActions,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import { checkInitialValue, checkPortName, checkSequenceIndex } from 'src/utils/project'

import toast from 'react-hot-toast'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'
import projectDevicesErrors from 'src/errors/projectDevicesErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  boardIndex: yup.string().required('Porta obrigatória'),
  index: yup.string().required('Sequencia obrigatória'),
  centralId: yup.string().required('Central obrigatória'),
  deviceId: yup.string().required('Dispositivo de saída obrigatório'),
  environmentId: yup.string().required('Ambiente obrigatório'),
  initialValue: yup.string().required('Valor inicial obrigatório'),
  voiceActivation: yup.string()
})

interface FormData {
  name: string
  projectId: string
  centralId: string
  boardIndex: string
  type: string
  moduleType: string
  index: number
  environmentId: string
  deviceId: string
  initialValue: string
  voiceActivation: string
}

interface AddOutputDeviceProps {
  environmentId: string
  environmentName: string
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const AddOutputDevice = memo(
  ({ handleClose, open, refresh, setRefresh, environmentId, environmentName }: AddOutputDeviceProps) => {
    const router = useRouter()

    const { id } = router.query

    const { handleErrorResponse } = useErrorHandling()
    const { handleAvaliableOutputPorts } = useProjectMenu()

    const [ports, setPorts] = useState<any[]>([])
    const [boardId, setBoardId] = useState<string | null>(null)
    const [boardIndex, setBoardIndex] = useState<string | null>(null)
    const [optionsInitialValue, setOptionsInitialValue] = useState<any[]>([])
    const [devicesAvailableOrNot, setDevicesAvailableOrNot] = useState<any[]>([])

    const { data: projectDevices } = useGetDataApi<any>({
      url: `/projectDevices/by-project/${id}`,
      params: {
        moduleType: 'INOUT'
      },
      callInit: router.isReady && open
    })

    const { data: devices, handleResetData: handleResetDevices } = useGetDataApi<any>({
      url: '/devices',
      params: {
        moduleType: 'OUTPUT'
      },
      callInit: router.isReady && open
    })

    const {
      control,
      handleSubmit,
      reset,
      setValue,
      getValues,
      watch,
      setError,
      clearErrors,
      formState: { errors }
    } = useForm({
      defaultValues: {
        projectId: id ? id : '',
        voiceActivation: 'false'
      } as FormData,
      mode: 'onBlur',
      resolver: yupResolver(schema)
    })

    const handleSetCentral = (event: SyntheticEvent) => {
      const { value } = event.target as HTMLInputElement

      setPorts([])

      if (value) {
        handleAvaliableOutputPorts(value).then((response: any[]) => {
          setPorts(response)
        })

        const central = projectDevices.data.filter((device: any) => device._id === value)[0]

        setBoardId(central.boardId)
        setValue('centralId', value)
        clearErrors('centralId')

        return
      }

      setValue('centralId', value)
      setError('centralId', { type: 'manual', message: 'Central obrigatória' })
    }

    const handleSetBoardIndex = async (event: SyntheticEvent) => {
      const { value } = event.target as HTMLInputElement

      if (value) {
        setValue('boardIndex', value)
        setBoardIndex(value)
        clearErrors('boardIndex')
        handleCheckDeviceOptions(devices?.data)

        return
      }

      setValue('boardIndex', value)
      setError('boardIndex', { type: 'manual', message: 'Porta obrigatória' })
    }

    const handleCheckDeviceOptions = (devices: any[]) => {
      const devicesFiltered = devices?.map((device: any) => {
        if (device?.outputTotal <= ports[Number(watch('boardIndex'))]?.keysQuantityAvaliable) {
          return Object.assign(device, { avaliable: true })
        }

        return Object.assign(device, { avaliable: false })
      })

      setDevicesAvailableOrNot(devicesFiltered)
    }

    const handleCheckDefaultValue = (operationType: string) => {
      switch (operationType) {
        case 'DIMMER':
          return '0'
        case 'RELES':
          return 'FALSE'
        case 'ENGINE':
          return 'CLOSE'
        default:
          return ''
      }
    }

    const handleSetDevice = (event: SyntheticEvent, devices: any) => {
      const { value } = event.target as HTMLInputElement

      if (value) {
        const device = devices.filter((device: any) => device._id === value)[0]

        setValue('deviceId', value)
        setValue('moduleType', device.moduleType)
        setValue('type', device.type)
        clearErrors('deviceId')

        const operationType = device.operationType

        const deviceInitialValue = checkInitialValue(operationType)
        const deviceDefaultValue = handleCheckDefaultValue(operationType)

        setValue('initialValue', deviceDefaultValue)

        return setOptionsInitialValue(deviceInitialValue)
      }

      setValue('deviceId', value)
      setError('deviceId', { type: 'manual', message: 'Dispositivo de entrada obrigatório' })
    }

    const handleSetVoiceActivation = (event: SyntheticEvent) => {
      const { checked } = event.target as HTMLInputElement

      setValue('voiceActivation', String(checked))
    }

    const handleRenderDeviceOptions = (currentDevicesAvailable: any[]) => {
      if (currentDevicesAvailable.length > 0)
        return currentDevicesAvailable.map(device => (
          <MenuItem key={device._id} value={device._id} disabled={!device.avaliable}>
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
        voiceActivation: formData.voiceActivation === 'true' ? true : false,
        isCentral: false
      })

      api
        .post('/projectDevices', data)
        .then(response => {
          if (response.status === 201) {
            handleClose()
            toast.success('Dispositivo de saída adicionado com sucesso!')
            setRefresh(!refresh)
          }
        })
        .catch(error => {
          handleClose()
          handleErrorResponse({
            error: error,
            errorReference: projectDevicesErrors,
            defaultErrorMessage: 'Erro ao adicionar dispositivo de saída, tente novamente mais tarde.'
          })
        })
    }

    useEffect(() => {
      if (!open) {
        reset()
        setPorts([])
        handleResetDevices()
        setBoardId(null)
        setBoardIndex(null)
      }

      setValue('environmentId', environmentId)

      return () => {
        reset()
        setPorts([])
        handleResetDevices()
        setBoardId(null)
        setBoardIndex(null)
      }
    }, [environmentId, handleResetDevices, open, reset, setValue])

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
          Adicionar Dispositivo de Saída
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            Selecione a central, o dispositivo de saída que deseja adicionar e as demais configurações
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
                      {projectDevices?.data.map((device: any) => (
                        <MenuItem key={device._id} value={device._id}>
                          {device.name}
                        </MenuItem>
                      ))}
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
                        <em>{boardId ? 'Selecione' : 'Selecione uma central primeiro'}</em>
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
                        <em>{boardIndex ? 'Selecione' : 'Selecione uma porta primeiro'}</em>
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
                      label='Dispositivo de Saída'
                      required
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={e => handleSetDevice(e, devices?.data)}
                      error={Boolean(errors.deviceId)}
                      {...(errors.deviceId && { helperText: errors.deviceId.message })}
                    >
                      <MenuItem value='' disabled>
                        <em>{boardIndex ? 'Selecione' : 'Selecione uma porta primeiro'}</em>
                      </MenuItem>
                      {handleRenderDeviceOptions(devicesAvailableOrNot)}
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
                      label='Nome do Dispositivo de saída'
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
                  name='initialValue'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Valor Inicial'
                      required
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.initialValue)}
                      {...(errors.initialValue && { helperText: errors.initialValue.message })}
                    >
                      <MenuItem value='' disabled>
                        <em>{watch('deviceId') ? 'Selecione' : 'Selecione um dispositivo primeiro'}</em>
                      </MenuItem>
                      {optionsInitialValue.map((initialValue: any, index: number) => (
                        <MenuItem key={index} value={initialValue?.value}>
                          {initialValue?.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={4} alignContent={'end'}>
                <Controller
                  name='voiceActivation'
                  control={control}
                  render={({ field: { value, onBlur } }) => (
                    <FormControlLabel
                      onChange={(e: SyntheticEvent) => handleSetVoiceActivation(e)}
                      checked={value === 'true'}
                      onBlur={onBlur}
                      control={<Checkbox />}
                      label='Ativação por voz'
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
)

export default AddOutputDevice
