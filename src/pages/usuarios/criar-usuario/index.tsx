import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  status: yup.string().required('Status obrigatório'),
  password: yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Senha obrigatória'),
  confirmPassword: yup
    .string()
    .required('Confirmação de senha obrigatória')
    .equals([yup.ref('password')], 'As senhas não coincidem')
})

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  status: string
  type: string
}

const CreateUser = () => {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      status: 'ACTIVE',
      password: '',
      confirmPassword: '',
      type: 'ADMIN'
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    api
      .post('/users', {
        name: data.name,
        email: data.email,
        password: data.password,
        status: data.status,
        type: data.type
      })
      .then(response => {
        if (response.status === 201) {
          toast.success('Usuário adicionado com sucesso!')
          router.push('/usuarios')
        }
      })
      .catch(error => {
        if (error.response.status === 409) {
          setError('email', { type: 'manual', message: 'E-mail já cadastrado' })

          return toast.error('E-mail já cadastrado')
        }
        toast.error('Erro ao criar usuário, tente novamente mais tarde')
      })
  }

  return (
    <Card>
      <CardHeader title='Adicionar Usuário' />
      <CardContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} lg={4}>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Nome'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Nome'
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                    InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='E-mail'
                    type='email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='E-mail'
                    error={Boolean(errors.email)}
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Controller
                name='status'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Status'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.status)}
                    {...(errors.status && { helperText: errors.status.message })}
                  >
                    <MenuItem value='ACTIVE'>Ativo</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                name='confirmPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onBlur={onBlur}
                    label='Confirmar Senha'
                    onChange={onChange}
                    placeholder='Confirmar Senha'
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
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                <Button variant='outlined' sx={{ mr: 2 }} onClick={() => router.push('/usuarios')}>
                  Cancelar
                </Button>
                <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                  Adicionar Usuário
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

CreateUser.acl = {
  action: 'manage',
  subject: 'admin'
}

export default CreateUser
