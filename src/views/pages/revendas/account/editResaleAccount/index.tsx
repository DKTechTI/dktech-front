import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  InputAdornment,
  MenuItem,
  DialogActions,
  Button
} from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import toast from 'react-hot-toast'

import { formatDocumentNumber } from 'src/utils/formatDocumentNumber'

import { api } from 'src/services/api'

import { ResaleProps } from 'src/types/resales'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido'),
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
          return schema.min(8, 'Documento inválido')
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
  type?: string
  stateRegistration?: string
  municipalRegistration?: string
  phone?: string
  cellphone?: string
  documentNumber: string
  documentType: string
  cep: string
  address: string
  neighborhood: string
  city: string
  state: string
  number: string
  complement: string
  referenceCarrier?: string
}

interface EditProfileProps {
  openEdit: boolean
  handleEditClose: () => void
  data: ResaleProps
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const EditResaleAccount = ({ openEdit, handleEditClose, data, refresh, setRefresh }: EditProfileProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { ...data, documentNumber: formatDocumentNumber(data.documentNumber, data.documentType) },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (formData: FormData) => {
    if (formData['type']) {
      delete formData['type']
    }

    api
      .put(`/users/${data._id}`, formData)
      .then(response => {
        if (response.status === 200) {
          handleEditClose()
          toast.success('Revenda atualizada com sucesso!')
          setRefresh(!refresh)
        }
      })
      .catch(() => {
        handleEditClose()
        toast.error('Erro ao atualizar revenda, tente novamente mais tarde')
      })
  }

  return (
    <Dialog
      open={openEdit}
      onClose={handleEditClose}
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
        Editar Revenda
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Edite as informações da revenda
        </DialogContentText>
        <form noValidate autoComplete='off'>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Nome'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='companyName'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='status'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Status'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.status)}
                    {...(errors.status && { helperText: errors.status.message })}
                  >
                    <MenuItem value='ACTIVE'>Ativo</MenuItem>
                    <MenuItem value='INACTIVE'>Inativo</MenuItem>
                    <MenuItem value='BLOCKED'>Bloqueado</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='documentType'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo de Documento'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.documentType)}
                    {...(errors.documentType && { helperText: errors.documentType.message })}
                  >
                    <MenuItem value='CPF'>CPF</MenuItem>
                    <MenuItem value='CNPJ'>CNPJ</MenuItem>
                    <MenuItem value='OTHER'>Outro</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='documentNumber'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Número do Documento'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='stateRegistration'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='municipalRegistration'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='cep'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='CEP'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='city'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Cidade'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Endereço'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='neighborhood'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Bairro'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='state'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Estado'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='number'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Número do Endereço'
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='complement'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='cellphone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='referenceCarrier'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
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
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
          Salvar
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleEditClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditResaleAccount
