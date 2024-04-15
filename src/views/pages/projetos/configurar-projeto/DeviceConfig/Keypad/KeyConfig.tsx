import { useRouter } from 'next/router'

import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  MenuItem,
  Typography
} from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import { api } from 'src/services/api'

import ScenesConfig from './ScenesConfig'

const schemaKey = yup.object().shape({
  name: yup.string().required('Nome da tecla obrigatório'),
  ledAction: yup.string().required('Led keypad obrigatório'),
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
  ledAction: string
  name: string
}

const KeyConfig = () => {
  const router = useRouter()

  const { id } = router.query

  const { refreshDeviceKeys, setRefreshDeviceKeys, keyId, environmentId } = useDeviceKeys()
  const { refreshMenu, setRefreshMenu } = useProjectMenu()

  const { data: keyData, loading } = useGetDataApi<any>({
    url: `/projectDeviceKeys/${keyId}`,
    callInit: Boolean(keyId)
  })

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
      projectDeviceId: keyData?.data?.projectDeviceId ?? '',
      environmentId: keyData?.data?.environmentId ?? '',
      centralId: keyData?.data?.centralId ?? '',
      name: keyData?.data?.name ?? '',
      moduleType: keyData?.data?.moduleType ?? '',
      keyType: keyData?.data?.keyType ?? '',
      keyOrder: String(keyData?.data?.keyOrder) ?? '',
      ledAction: keyData?.data?.ledAction ?? ''
    } as FormDataKey,
    mode: 'onBlur',
    resolver: yupResolver(schemaKey)
  })

  const onSubmitKey = (formData: FormDataKey) => {
    const data = formData

    Object.assign(data, {
      keyOrder: Number(formData.keyOrder)
    })

    api
      .put(`/projectDeviceKeys/${keyId}`, data)
      .then(response => {
        if (response.status === 200) {
          toast.success('Tecla atualizada com sucesso!')
          setRefreshDeviceKeys(!refreshDeviceKeys)
          setRefreshMenu(!refreshMenu)
        }
      })
      .catch(() => {
        toast.error('Erro ao atualizar tecla, tente novamente mais tarde')
      })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant='h4'>Carregando...</Typography>
        </Box>
      </Box>
    )
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name='name'
                  control={controlKey}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Nome da Tecla'
                      required
                      value={value || ''}
                      onBlur={onBlur}
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
                  name='ledAction'
                  control={controlKey}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Led Keypad'
                      required
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errorsKey.ledAction)}
                      {...(errorsKey.ledAction && { helperText: errorsKey.ledAction.message })}
                    >
                      <MenuItem disabled value=''>
                        <em>selecione</em>
                      </MenuItem>
                      <MenuItem value='ON'>Ligar</MenuItem>
                      <MenuItem value='OFF'>Desligar</MenuItem>
                      <MenuItem value='FOLLOW'>Seguir a Cena</MenuItem>
                      <MenuItem value='NONE'>Sem Efeito</MenuItem>
                    </CustomTextField>
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
          <CardActions
            sx={{
              paddingBottom: '0px !important'
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'end' }}>
              <Button variant='contained' onClick={handleSubmitKey(onSubmitKey)}>
                Salvar
              </Button>
            </Box>
          </CardActions>
        </Box>
        <ScenesConfig keyId={keyId} />
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

export default KeyConfig
