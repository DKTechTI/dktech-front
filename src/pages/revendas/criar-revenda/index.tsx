import { Box, Button, Card, CardContent, CardHeader, Grid, InputAdornment, MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { delay } from 'src/utils/delay'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  status: yup.string().required('Status obrigatório'),
  documentType: yup.string().required('Tipo de documento obrigatório'),
  documentNumber: yup
    .string()
    .required('Número do documento obrigatório')
    .when('documentType', ([documentType], schema) => {
      switch (documentType) {
        case 'CPF':
          return schema.matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, 'CPF inválido')
        case 'CNPJ':
          return schema.matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido')
        default:
          return schema.min(9, 'Documento inválido')
      }
    }),
  companyName: yup.string().when('documentType', ([documentType], schema) => {
    if (documentType === 'CNPJ') return schema.required('Nome da empresa obrigatório')

    return schema.notRequired()
  }),
  phone: yup.string(),
  cellphone: yup.string(),
  stateRegistration: yup.string(),
  municipalRegistration: yup.string(),
  cep: yup.string().required('CEP obrigatório'),
  city: yup.string().required('Cidade obrigatória'),
  address: yup.string().required('Endereço obrigatório'),
  neighborhood: yup.string().required('Bairro obrigatório'),
  state: yup.string().required('Estado obrigatório'),
  number: yup.string().required('Número obrigatório'),
  complement: yup.string(),
  referenceCarrier: yup.string()
})

interface FormData {
  name: string
  companyName: string
  email: string
  password: string
  status: string
  type: string
  documentType: string
  documentNumber: string
  phone: string
  cellphone: string
  stateRegistration: string
  municipalRegistration: string
  cep: string
  city: string
  address: string
  neighborhood: string
  state: string
  number: string
  complement: string
  referenceCarrier: string
}

const CreateResale = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      password: 'password',
      status: 'ACTIVE',
      type: 'CLIENT',
      documentType: '',
      documentNumber: '',
      phone: '',
      cellphone: '',
      stateRegistration: '',
      municipalRegistration: '',
      cep: '',
      city: '',
      address: '',
      neighborhood: '',
      state: '',
      number: '',
      complement: '',
      referenceCarrier: ''
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    api
      .post('/users', data)
      .then(response => {
        if (response.status === 201) {
          toast.success('Revenda adicionada com sucesso!')
          delay(2000).then(() => {
            router.push('/revendas')
          })
        }
      })
      .catch(error => {
        if (error.response.status === 409) {
          setError('email', { type: 'manual', message: 'E-mail já cadastrado' })

          return toast.error('E-mail já cadastrado')
        }
        toast.error('Erro ao criar revenda, tente novamente mais tarde')
      })
  }

  return (
    <Card>
      <CardHeader title='Adicionar Revenda' />
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
                name='companyName'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Nome da Empresa'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Nome da Empresa'
                    error={Boolean(errors.companyName)}
                    {...(errors.companyName && { helperText: errors.companyName.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='E-mail'
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
            <Grid item xs={12} sm={6} lg={4} xl={3}>
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
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    <MenuItem value='ACTIVE'>Ativo</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='documentType'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo de Documento'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.documentType)}
                    {...(errors.documentType && { helperText: errors.documentType.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    <MenuItem value='CPF'>CPF</MenuItem>
                    <MenuItem value='CNPJ'>CNPJ</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='documentNumber'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Número do Documento'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Número do Documento'
                    error={Boolean(errors.documentNumber)}
                    {...(errors.documentNumber && { helperText: errors.documentNumber.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='stateRegistration'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Inscrição Estadual'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Inscrição Estadual'
                    error={Boolean(errors.stateRegistration)}
                    {...(errors.stateRegistration && { helperText: errors.stateRegistration.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='municipalRegistration'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Inscrição Municipal'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Inscrição Municipal'
                    error={Boolean(errors.municipalRegistration)}
                    {...(errors.municipalRegistration && { helperText: errors.municipalRegistration.message })}
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
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <Controller
                name='referenceCarrier'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Transportadora Preferencial'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Transportadora Preferencial'
                    error={Boolean(errors.referenceCarrier)}
                    {...(errors.referenceCarrier && { helperText: errors.referenceCarrier.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                <Button variant='outlined' sx={{ mr: 2 }} onClick={() => router.push('/revendas')}>
                  Cancelar
                </Button>
                <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                  Adicionar Revenda
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

CreateResale.acl = {
  action: 'manage',
  subject: 'admin'
}

export default CreateResale
