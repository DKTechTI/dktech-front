import { useRouter } from 'next/router'

import { Box, Button, Card, CardContent, CardHeader, Grid, InputAdornment } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

import toast from 'react-hot-toast'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'

import { delay } from 'src/utils/delay'

import clientsErrors from 'src/errors/clientsErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  status: yup.string().required('Status obrigatório'),
  phone: yup.string(),
  cellphone: yup.string(),
  cep: yup.string().required('CEP obrigatório'),
  city: yup.string().required('Cidade obrigatória'),
  address: yup.string().required('Endereço obrigatório'),
  neighborhood: yup.string().required('Bairro obrigatório'),
  state: yup.string().required('Estado obrigatório'),
  number: yup
    .number()
    .typeError('Número do endereço deve conter apenas números')
    .required('Número do endereço obrigatório'),
  complement: yup.string()
})

interface FormData {
  name: string
  status: string
  phone: string
  cellphone: string
  cep: string
  city: string
  address: string
  neighborhood: string
  state: string
  number: number
  complement: string
}

const CreateClient = () => {
  const router = useRouter()
  const { handleErrorResponse } = useErrorHandling()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      status: 'ACTIVE',
      phone: '',
      cellphone: '',
      cep: '',
      city: '',
      address: '',
      neighborhood: '',
      state: '',
      complement: ''
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    api
      .post('/clients', data)
      .then(response => {
        if (response.status === 201) {
          toast.success('Cliente adicionado com sucesso!')
          delay(2000).then(() => {
            router.push('/clientes')
          })
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: clientsErrors,
          defaultErrorMessage: 'Erro ao criar cliente, tente novamente mais tarde.'
        })
      })
  }

  return (
    <Card>
      <CardHeader title='Adicionar Cliente' />
      <CardContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
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
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='cep'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='CEP'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='CEP'
                    error={Boolean(errors.cep)}
                    {...(errors.cep && { helperText: errors.cep.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='city'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Cidade'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Cidade'
                    error={Boolean(errors.city)}
                    {...(errors.city && { helperText: errors.city.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='address'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Endereço'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Endereço'
                    error={Boolean(errors.address)}
                    {...(errors.address && { helperText: errors.address.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='neighborhood'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Bairro'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Bairro'
                    error={Boolean(errors.neighborhood)}
                    {...(errors.neighborhood && { helperText: errors.neighborhood.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='state'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Estado'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Estado'
                    error={Boolean(errors.state)}
                    {...(errors.state && { helperText: errors.state.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='number'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Número do Endereço'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Número do Endereço'
                    error={Boolean(errors.number)}
                    {...(errors.number && { helperText: errors.number.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='complement'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Complemento'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Complemento'
                    error={Boolean(errors.complement)}
                    {...(errors.complement && { helperText: errors.complement.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='cellphone'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Telefone'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Telefone'
                    error={Boolean(errors.cellphone)}
                    {...(errors.cellphone && { helperText: errors.cellphone.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Telefone Fixo'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Telefone Fixo'
                    error={Boolean(errors.phone)}
                    {...(errors.phone && { helperText: errors.phone.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                <Button variant='outlined' sx={{ mr: 2 }} onClick={() => router.push('/clientes')}>
                  Cancelar
                </Button>
                <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                  Adicionar Cliente
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

CreateClient.acl = {
  action: 'read',
  subject: 'client'
}

export default CreateClient
