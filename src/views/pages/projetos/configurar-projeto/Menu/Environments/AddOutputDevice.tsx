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

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  boardIndex: yup.string().required('Porta obrigatória'),
  index: yup.string().required('Sequencia obrigatória'),
  centralId: yup.string().required('Central obrigatória'),
  deviceId: yup.string().required('Dispositivo de entrada obrigatório'),
  environmentId: yup.string().required('Ambiente obrigatório'),
  initialValue: yup.string().required('Valor inicial obrigatório'),
  voiceActivation: yup.string()
})

interface FormData {
  name: string
  projectId: string
  centralId: string
  boardId: string
  boardIndex: string
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

const AddOutputDevice = ({
  handleClose,
  open,
  refresh,
  setRefresh,
  environmentId,
  environmentName
}: AddOutputDeviceProps) => {
  const router = useRouter()

  const { id } = router.query

  const { handleAvaliableOutputPorts } = useProjectMenu()

  const [ports, setPorts] = useState<any[]>([])

  const { data: projectDevices } = useGetDataApi<any>({
    url: `/projectDevices/by-project/${id}`,
    callInit: router.isReady && open
  })

  const { data: devices } = useGetDataApi<any>({ url: '/devices', callInit: router.isReady && open })

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
      setPorts(handleAvaliableOutputPorts(value))

      const central = projectDevices.data.filter((device: any) => device.centralId === value)[0]

      setValue('boardId', central.boardId)
      setValue('centralId', value)
      clearErrors('centralId')

      return
    }

    setValue('centralId', value)
    setError('centralId', { type: 'manual', message: 'Central obrigatória' })
  }

  const handleSetBoardIndex = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement

    if (value) {
      setValue('boardIndex', value)
      clearErrors('boardIndex')

      return
    }

    setValue('boardIndex', value)
    setError('boardIndex', { type: 'manual', message: 'Porta obrigatória' })
  }

  const handleSetVoiceActivation = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement

    setValue('voiceActivation', String(checked))
  }

  const handleCheckInitialValue = (deviceId: string) => {
    const device = devices?.data.filter((device: any) => device._id === deviceId)[0]

    const deviceInitialValue = checkInitialValue(device?.operationType)

    return deviceInitialValue
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
      .catch(() => {
        handleClose()
        toast.error('Erro ao adicionar dispositivo de saída, tente novamente mais tarde')
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
        Adicionar Dispositivo de saída
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
                    <MenuItem value=''>
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
                    <MenuItem value=''>
                      <em>{watch('centralId') ? 'Selecione' : 'Selecione uma central primeiro'}</em>
                    </MenuItem>
                    {ports.map((port: any, index: number) => (
                      <MenuItem key={index} value={port.port} disabled={!port.avaliable}>
                        {checkPortName(Number(port?.port))}
                      </MenuItem>
                    ))}
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
                    <MenuItem value=''>
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
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Dispositivo de Saída'
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
                      if (device.moduleType === 'OUTPUT') {
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
                    <MenuItem value=''>
                      <em>{watch('deviceId') ? 'Selecione' : 'Selecione um dispositivo primeiro'}</em>
                    </MenuItem>
                    {handleCheckInitialValue(watch('deviceId')).map((initialValue: any, index: number) => {
                      return (
                        <MenuItem key={index} value={initialValue?.value}>
                          {initialValue?.name}
                        </MenuItem>
                      )
                    })}
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
                    <MenuItem value=''>
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

export default AddOutputDevice