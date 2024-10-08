import { ChangeEvent, memo, SyntheticEvent } from 'react'

import { Box, Button, Grid, useMediaQuery, Checkbox, FormControlLabel, MenuItem } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { checkInitialValue } from 'src/utils/project'
import { useAutoSave } from 'src/hooks/useAutoSave'

import toast from 'react-hot-toast'
import { api } from 'src/services/api'
import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesKeysErrors from 'src/errors/projectDevicesKeysErrors'

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  environmentId: yup.string().required('Ambiente da tecla obrigatório'),
  initialValue: yup.string().required('Valor Inicial é obrigatório'),
  voiceActivation: yup.string().required('Ativação por Voz é obrigatório')
})

interface FormData {
  _id: string
  name: string
  environmentId: string
  initialValue: string
  voiceActivation: string
}

interface BlockButtonTryKeyProps {
  blockButtonTryKey: boolean
  setBlockButtonTryKey: (value: boolean) => void
}

interface TryKeyProps {
  keyData: any
  operationType: string
  environments: any[]
  blockButton: BlockButtonTryKeyProps
}

const TryKey = memo(({ keyData, operationType, environments, blockButton }: TryKeyProps) => {
  const matches = useMediaQuery('(min-width:1534px)')

  const { blockButtonTryKey, setBlockButtonTryKey } = blockButton

  const { handleSaveOnStateChange } = useAutoSave()
  const { handleErrorResponse } = useErrorHandling()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    values: {
      ...keyData,
      voiceActivation: String(keyData.voiceActivation)
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleSetVoiceActivation = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement

    setValue('voiceActivation', String(checked))

    onSubmit(getValues())
  }

  const handleSetEnvironment = (environmentId: string) => {
    setValue('environmentId', environmentId)

    onSubmit(getValues())
  }

  const handleSetInitialValue = (initialValue: string) => {
    setValue('initialValue', initialValue)

    onSubmit(getValues())
  }

  const handleCheckInitialValue = (operationType: string) => {
    const deviceInitialValue = checkInitialValue(operationType)

    return deviceInitialValue
  }

  const handleFromatRequest = async (data: any) => {
    const voiceActivationValue: { [key: string]: boolean } = {
      true: true,
      false: false
    }

    if (data) {
      return {
        projectId: keyData.projectId,
        projectDeviceId: keyData.projectDeviceId,
        environmentId: data.environmentId,
        moduleType: keyData.moduleType,
        keyOrder: Number(data.order),
        name: data.name,
        initialValue: data.initialValue,
        voiceActivation: voiceActivationValue[data.voiceActivation]
      }
    }

    return null
  }

  const handleTryKey = (keyId: string) => {
    setBlockButtonTryKey(true)

    api
      .get(`/mqtt/identify-load/${keyId}`)
      .then(response => {
        if (response.status === 200) return toast.success('Carga acionada com sucesso.')
      })
      .catch(error => {
        handleErrorResponse({
          error,
          errorReference: projectDevicesKeysErrors,
          defaultErrorMessage: 'Erro ao acionar carga, tente novamente mais tarde.'
        })
      })
      .finally(() => setBlockButtonTryKey(false))
  }

  const onSubmit = async (data: FormData) => {
    const responseTypeStatus: { [key: number]: string } = {
      200: 'Dados salvos com sucesso'
    }

    const dataFormatted = await handleFromatRequest(data)

    if (!dataFormatted) return toast.error('Erro ao formatar os dados, tente novamente mais tarde.')

    handleSaveOnStateChange({
      apiUrl: `/projectDeviceKeys/${data._id}`,
      storageData: dataFormatted,
      httpMethod: 'PUT',
      refreshOn: ['menu']
    })
      .then(response => {
        if (response && response.status === 200) return toast.success(responseTypeStatus[response.status])
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: projectDevicesKeysErrors,
          defaultErrorMessage: 'Erro ao atualizar os dados, tente novamente mais tarde.'
        })
      })
  }

  return (
    <Grid container gap={4} alignItems={'end'} justifyContent={'space-around'}>
      <Grid item xs={12} sm={5} md={2} lg={2} xl={2}>
        <Controller
          name='name'
          control={control}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              label='Nome'
              required
              value={value || ''}
              onBlur={handleSubmit(onSubmit)}
              onChange={onChange}
              placeholder='Nome'
              error={Boolean(errors.name)}
              {...(errors.name && { helperText: errors.name.message })}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={2} lg={3} xl={2}>
        <Controller
          name='environmentId'
          control={control}
          render={({ field: { value } }) => (
            <CustomTextField
              select
              fullWidth
              label='Ambiente da Tecla'
              required
              value={value || ''}
              onBlur={handleSubmit(onSubmit)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSetEnvironment(e.target.value)}
              error={Boolean(errors.environmentId)}
              {...(errors.environmentId && { helperText: errors.environmentId.message })}
            >
              <MenuItem value=''>
                <em>selecione</em>
              </MenuItem>
              {environments &&
                environments.map((environment: any) => (
                  <MenuItem key={environment._id} value={environment._id}>
                    {environment.name}
                  </MenuItem>
                ))}
            </CustomTextField>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={2} lg={3} xl={2}>
        <Controller
          name='initialValue'
          control={control}
          render={({ field: { value } }) => (
            <CustomTextField
              select
              fullWidth
              label='Valor Inicial'
              required
              value={value || ''}
              onBlur={handleSubmit(onSubmit)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSetInitialValue(e.target.value)}
              error={Boolean(errors.initialValue)}
              {...(errors.initialValue && { helperText: errors.initialValue.message })}
            >
              <MenuItem value='' disabled>
                <em>Selecione</em>
              </MenuItem>
              {handleCheckInitialValue(operationType).map((initialValue: any, index: number) => {
                return (
                  <MenuItem key={index} value={initialValue?.value || ''}>
                    {initialValue?.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={2} lg={3} xl={2}>
        <Controller
          name='voiceActivation'
          control={control}
          render={({ field: { value } }) => (
            <FormControlLabel
              onChange={(e: SyntheticEvent) => handleSetVoiceActivation(e)}
              checked={value === 'true'}
              control={<Checkbox />}
              label='Ativação por voz'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={2} lg={12} xl={2}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            fullWidth={matches}
            variant='contained'
            color='primary'
            sx={{ minWidth: '138px' }}
            startIcon={<IconifyIcon icon='tabler:wifi' />}
            onClick={() => handleTryKey(keyData._id)}
            disabled={blockButtonTryKey}
          >
            {blockButtonTryKey ? 'Aguarde...' : 'Testar'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
})

export default TryKey
