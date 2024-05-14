import { ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import CustomTextField from 'src/@core/components/mui/text-field'

import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import themeConfig from 'src/configs/themeConfig'

import toast from 'react-hot-toast'

import { api } from 'src/services/api'

import { isAxiosError } from 'axios'
import authErrors from 'src/errors/authErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const schema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório')
})

interface FormData {
  email: string
}

const ForgotPassword = () => {
  const theme = useTheme()
  const router = useRouter()
  const { handleErrorResponse } = useErrorHandling()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { email: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    api
      .post('/auth/email-reset-password', {
        email: data.email
      })
      .then(response => {
        if (response.status === 200) {
          toast.success('Email enviado com sucesso')
          router.push('/login')
        }
      })
      .catch(error => {
        if (!isAxiosError(error)) return toast.error('Ocorreu um erro, tente novamente.')
        if (error.response) {
          const message = handleErrorResponse({
            error: error.response.status,
            message: error.response.data.message,
            referenceError: authErrors
          })
          message ? toast.error(message) : toast.error('Erro ao enviar e-mail de redefinição de senha.')
        }
      })
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                />
              </svg>
              <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5 }}>
                Esqueceu a senha? 🔒
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Digite o email associado à sua conta e enviaremos um link para redefinir sua senha
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      type='email'
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='E-mail'
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Box>
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Enviar link de redefinição
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Voltar para o login</span>
                </LinkStyled>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
