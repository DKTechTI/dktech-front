// ** React Imports
import { useState } from 'react'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

import Icon from 'src/@core/components/icon'

import CustomTextField from 'src/@core/components/mui/text-field'
import { Box } from '@mui/system'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { delay } from 'src/utils/delay'
import { useAuth } from 'src/hooks/useAuth'

import { isAxiosError } from 'axios'
import authErrors from 'src/errors/authErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const schema = yup.object().shape({
  password: yup.string().required('Senha obrigatória'),
  newPassword: yup.string().min(8, 'minino de 8 caracteres').required('Nova senha obrigatória'),
  confirmPassword: yup
    .string()
    .required('Confirmação de nova senha obrigatória')
    .equals([yup.ref('newPassword')], 'As senhas não coincidem')
})

interface FormData {
  password: string
  newPassword: string
  confirmPassword: string
}

const ChangePassword = () => {
  const { logout, user } = useAuth()
  const { handleErrorResponse } = useErrorHandling()

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    api
      .put('/auth/change-password', {
        oldPassword: data.password,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        userId: user?.id
      })
      .then(response => {
        if (response.status === 200) {
          toast.success('Senha alterada com sucesso, faça login novamente')
          delay(2000).then(() => {
            logout()
          })
        }
      })
      .catch(error => {
        if (!isAxiosError(error)) toast.error('Erro ao redefinir senha, tente novamente.')
        if (error.response) {
          const message = handleErrorResponse({
            error: error.response.status,
            message: error.response.data.message,
            referenceError: authErrors
          })
          message ? toast.error(message) : toast.error('Erro ao redefinir senha, tente novamente.')
        }
      })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Alterar Senha' />
          <CardContent>
            <Alert icon={false} severity='warning' sx={{ mb: 4 }}>
              <AlertTitle
                sx={{ fontWeight: 500, fontSize: '1.125rem', mb: theme => `${theme.spacing(2.5)} !important` }}
              >
                Requerimentos de senha
              </AlertTitle>
              Mínino de 8 caracteres
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        label='Senha'
                        onChange={onChange}
                        placeholder='Senha'
                        error={Boolean(errors.password)}
                        {...(errors.password && { helperText: errors.password.message })}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
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
                    name='newPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        label='Nova Senha'
                        onChange={onChange}
                        placeholder='Nova Senha'
                        error={Boolean(errors.newPassword)}
                        {...(errors.newPassword && { helperText: errors.newPassword.message })}
                        type={showNewPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                <Icon fontSize='1.25rem' icon={showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
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
                    name='confirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        label='Confirmar nova Senha'
                        onChange={onChange}
                        placeholder='Confirmação de nova Senha'
                        error={Boolean(errors.confirmPassword)}
                        {...(errors.confirmPassword && { helperText: errors.confirmPassword.message })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button type='submit' variant='contained'>
                      Salvar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ChangePassword
