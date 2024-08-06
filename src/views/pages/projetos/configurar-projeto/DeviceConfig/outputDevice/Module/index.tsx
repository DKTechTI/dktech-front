import { SyntheticEvent, useEffect, useState } from 'react'

import { Box, CardContent, CardHeader, CircularProgress, Grid, MenuItem, Typography } from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

import Keys from './Keys'

import { useDeviceKeys } from 'src/hooks/useDeviceKeys'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { checkPortName, checkSequenceIndex } from 'src/utils/project'

import toast from 'react-hot-toast'

import { api } from 'src/services/api'

import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesErrors from 'src/errors/projectDevicesErrors'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  boardIndex: yup.string().required('Porta obrigatório'),
  index: yup.string().required('Sequência obrigatório')
})

interface FormData {
  projectId: string
  centralId: string
  name: string
  modelName: string
  moduleType: string
  boardIndex: string
  index: string
  isCentral: boolean
  voiceActivation: boolean
}

interface ModuleProps {
  deviceData: any
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const Module = ({ deviceData, refresh, setRefresh }: ModuleProps) => {
  const { handleErrorResponse } = useErrorHandling()
  const { setDeviceId, setProjectDeviceId, deviceKeys, loadingDeviceKeys } = useDeviceKeys()
  const {
    handleAvaliableOutputPorts,
    setRefreshMenu,
    refreshMenu,
    handleCheckDeviceSequence,
    handleCheckDevicePort,
    menu
  } = useProjectMenu()

  const [ports, setPorts] = useState<any[] | null>(null)
  const [sequences, setSequences] = useState<any[] | null>(null)
  const [isReady, setIsReady] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    values: {
      projectId: deviceData?.projectId,
      centralId: deviceData?.centralId,
      name: deviceData?.name,
      modelName: deviceData?.modelName,
      moduleType: deviceData?.moduleType,
      boardIndex: '',
      index: '',
      isCentral: deviceData?.isCentral,
      voiceActivation: deviceData?.voiceActivation
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleCheckAvailablePortsAndSequences = async (centralId: string) => {
    const outputPorts = await handleAvaliableOutputPorts(centralId)
    const outputSequence = outputPorts[Number(watch('boardIndex'))]?.sequenceUpdate

    const portsOptions = Array.isArray(outputSequence)
      ? outputPorts.map((port: any, index: number) => (
          <MenuItem key={index} value={port.port} disabled={!port.avaliable}>
            {checkPortName(Number(port?.port))}
          </MenuItem>
        ))
      : null

    const sequencesOptions = Array.isArray(outputSequence)
      ? outputSequence.map((sequence: any, index: number) => (
          <MenuItem key={index} value={sequence.index} disabled={!sequence.avaliable}>
            {checkSequenceIndex(sequence.index)}
          </MenuItem>
        ))
      : null

    return { portsOptions, sequencesOptions }
  }

  const handleChangePort = (event: SyntheticEvent, data: any) => {
    const { value } = event.target as HTMLInputElement

    if (value) {
      const previousSequence = getValues('index')

      api
        .put(`/projectDevices/update-menu-index/${data?.centralId}`, {
          from: Number(previousSequence),
          moduleType: data?.moduleType,
          boardIndex: data?.boardIndex,
          toPort: Number(value)
        })
        .then(response => {
          if (response.status === 200) {
            setValue('boardIndex', value)
            clearErrors('boardIndex')
            setRefreshMenu(!refreshMenu)
          }
        })
        .catch(error => {
          handleErrorResponse({
            error: error,
            errorReference: projectDevicesErrors,
            defaultErrorMessage: 'Erro ao alterar porta, tente novamente mais tarde.'
          })
        })

      return
    }

    setValue('boardIndex', value)
    setError('boardIndex', { type: 'manual', message: 'Porta obrigatória' })
  }

  const handleChangeSequence = (event: SyntheticEvent, data: any) => {
    const { value } = event.target as HTMLInputElement

    if (value) {
      const previousSequence = getValues('index')

      api
        .put(`/projectDevices/update-menu-index/${data?.centralId}`, {
          from: Number(previousSequence),
          to: Number(value),
          moduleType: data?.moduleType,
          boardIndex: data?.boardIndex
        })
        .then(response => {
          if (response.status === 200) {
            setValue('index', value)
            clearErrors('index')
            setRefreshMenu(!refreshMenu)
          }
        })
        .catch(error => {
          handleErrorResponse({
            error: error,
            errorReference: projectDevicesErrors,
            defaultErrorMessage: 'Erro ao alterar sequência, tente novamente mais tarde.'
          })
        })

      return
    }

    setValue('index', value)
    setError('index', { type: 'manual', message: 'Sequência obrigatória' })
  }

  const formTrigger = () => {
    const form = document.getElementById('device-form')

    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const onSubmit = (formData: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, boardIndex, ...formattedData } = formData

    api
      .put(`/projectDevices/${deviceData?._id}`, formattedData)
      .then(response => {
        if (response.status === 200) {
          toast.success('Dados alterados com sucesso!')
          setRefresh(!refresh)
          setRefreshMenu(!refreshMenu)
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: projectDevicesErrors,
          defaultErrorMessage: 'Erro ao alterar dados, tente novamente mais tarde.'
        })
      })
  }

  useEffect(() => {
    if (deviceData) {
      setDeviceId(deviceData?.deviceId)
      setProjectDeviceId(deviceData?._id)
    }
  }, [deviceData, setDeviceId, setProjectDeviceId])

  useEffect(() => {
    const fetchData = async () => {
      if (deviceData) {
        const { portsOptions, sequencesOptions } = await handleCheckAvailablePortsAndSequences(deviceData?.centralId)

        setPorts(portsOptions)
        setSequences(sequencesOptions)

        const devicePort = handleCheckDevicePort(deviceData?._id, deviceData?.centralId, 'outputPorts')
        const deviceSequence = handleCheckDeviceSequence(deviceData?._id, deviceData?.centralId, 'outputPorts')

        if (devicePort !== null && String(devicePort)) setValue('boardIndex', String(devicePort))
        if (deviceSequence !== null && String(deviceSequence)) setValue('index', String(deviceSequence))

        setTimeout(() => {
          setIsReady(true)
        }, 300)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceData, menu])

  return (
    <Box>
      <CardHeader title={`Módulo: ${getValues('name')}`} />
      <CardContent>
        <form id='device-form' noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='modelName'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Modelo do Módulo'
                    required
                    disabled
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.modelName)}
                    {...(errors.modelName && { helperText: errors.modelName.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>selecione</em>
                    </MenuItem>
                    {deviceData?.modelName && <MenuItem value={deviceData.modelName}>{deviceData.modelName}</MenuItem>}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Nome'
                    required
                    value={value || ''}
                    onBlur={formTrigger}
                    onChange={onChange}
                    placeholder='Nome'
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
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
                    onChange={e => handleChangePort(e, watch())}
                    error={Boolean(errors.boardIndex)}
                    {...(errors.boardIndex && { helperText: errors.boardIndex.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>selecione</em>
                    </MenuItem>
                    {ports}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='index'
                control={control}
                render={({ field: { value, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Sequência'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={e => handleChangeSequence(e, watch())}
                    error={Boolean(errors.index)}
                    {...(errors.index && { helperText: errors.index.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>selecione</em>
                    </MenuItem>
                    {sequences}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} justifyContent={'center'}>
              {loadingDeviceKeys && !isReady && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '8.75rem'
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress />
                    <Typography variant='h4'>Carregando...</Typography>
                  </Box>
                </Box>
              )}
              {!loadingDeviceKeys && isReady && deviceKeys && <Keys keys={deviceKeys} />}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Box>
  )
}

export default Module
