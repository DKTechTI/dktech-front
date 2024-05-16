import { useRouter } from 'next/router'

import { Box, CardContent, CardHeader, Grid, MenuItem, Typography } from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useAutoSave } from 'src/hooks/useAutoSave'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import Scenes from '../../Scenes'

import toast from 'react-hot-toast'
import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesKeysErrors from 'src/errors/projectDevicesKeysErrors'

const schemaKey = yup.object().shape({
  name: yup.string().required('Nome da tecla obrigatório'),
  keyType: yup.string().required('Tipo da tecla obrigatório'),
  environmentId: yup.string().required('Ambiente da tecla obrigatório')
})

interface FormDataKey {
  projectId: string
  centralId: string
  projectDeviceId: string
  environmentId: string
  moduleType: string
  keyType: string
  keyOrder: string
  name: string
}

interface ConfigProps {
  keyData: any
}

const Config = ({ keyData }: ConfigProps) => {
  const router = useRouter()

  const { id } = router.query

  const { keyId, environmentId } = useDeviceKeys()
  const { handleSaveOnStateChange } = useAutoSave()
  const { handleErrorResponse } = useErrorHandling()

  const { data: environments } = useGetDataApi<any>({
    url: `/projectEnvironments/${environmentId}`,
    callInit: Boolean(keyId && router.isReady)
  })

  const {
    control: controlKey,
    handleSubmit: handleSubmitKey,
    getValues,
    formState: { errors: errorsKey }
  } = useForm({
    values: {
      projectId: id ?? '',
      projectDeviceId: keyData?.projectDeviceId ?? '',
      environmentId: keyData?.environmentId ?? '',
      centralId: keyData?.centralId ?? '',
      name: keyData?.name ?? '',
      moduleType: keyData?.moduleType ?? '',
      keyType: keyData?.keyType ?? '',
      keyOrder: String(keyData?.keyOrder) ?? ''
    } as FormDataKey,
    mode: 'onBlur',
    resolver: yupResolver(schemaKey)
  })

  const onSubmitKey = async (formData: FormDataKey) => {
    const responseTypeStatus: { [key: number]: string } = {
      200: 'Dados salvos com sucesso'
    }
    const data = formData

    Object.assign(data, {
      keyOrder: Number(formData.keyOrder)
    })

    const response = await handleSaveOnStateChange(`/projectDeviceKeys/${keyId}`, data, 'PUT', ['menu', 'deviceKeys'])

    if (response) {
      if (response.status === 200) return toast.success(responseTypeStatus[response.status])

      handleErrorResponse({
        error: response,
        errorReference: projectDevicesKeysErrors,
        defaultErrorMessage: 'Erro ao atualizar os dados, tente novamente mais tarde.'
      })
    }
  }

  if (keyId) {
    return (
      <Box>
        <Box>
          <CardHeader title={`Tecla: ${getValues('name')}`} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography variant='h6'>Configuração da Tecla</Typography>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='name'
                  control={controlKey}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Nome da Tecla'
                      required
                      value={value || ''}
                      onBlur={handleSubmitKey(onSubmitKey)}
                      onChange={onChange}
                      placeholder='Nome da Tecla'
                      error={Boolean(errorsKey.name)}
                      {...(errorsKey.name && { helperText: errorsKey.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='keyType'
                  control={controlKey}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Tipo da Tecla'
                      required
                      disabled
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errorsKey.keyType)}
                      {...(errorsKey.keyType && { helperText: errorsKey.keyType.message })}
                    >
                      <MenuItem value=''>
                        <em>selecione</em>
                      </MenuItem>
                      <MenuItem value='PULSATOR_NA'>NA</MenuItem>
                      <MenuItem value='PULSATOR_NF'>NF</MenuItem>
                      <MenuItem value='LIGHT_SWITCH'>Interruptor</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='environmentId'
                  control={controlKey}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Ambiente da Tecla'
                      required
                      disabled
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errorsKey.environmentId)}
                      {...(errorsKey.environmentId && { helperText: errorsKey.environmentId.message })}
                    >
                      <MenuItem value=''>
                        <em>selecione</em>
                      </MenuItem>
                      {environments?.data && (
                        <MenuItem key={environments?.data._id} value={environments?.data._id}>
                          {environments?.data.name}
                        </MenuItem>
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Box>
        <Scenes keyId={keyId} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        padding: '6rem 1rem'
      }}
    >
      <Typography variant='h5'>Escolha uma tecla para configurar</Typography>
    </Box>
  )
}

export default Config
