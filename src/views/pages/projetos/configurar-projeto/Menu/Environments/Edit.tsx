import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { Dialog, DialogTitle, DialogContent, DialogContentText, Grid, DialogActions, Button } from '@mui/material'

import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useGetDataApi from 'src/hooks/useGetDataApi'

import { api } from 'src/services/api'

const schema = yup.object().shape({
  name: yup.string().required('Nome do ambiente obrigatório')
})

interface FormData {
  projectId: string
  name: string
}

interface EditEnvironmentProps {
  environmentId: string
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const EditEnvironment = ({ open, handleClose, refresh, setRefresh, environmentId }: EditEnvironmentProps) => {
  const router = useRouter()

  const { id } = router.query

  const { data: environment } = useGetDataApi<any>({
    url: `/projectEnvironments/${environmentId}`,
    callInit: router.isReady && open
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    values: {
      projectId: id ? id : 'id',
      name: environment?.data?.name
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (formData: FormData) => {
    api
      .put(`/projectEnvironments/${environmentId}`, formData)
      .then(response => {
        if (response.status === 200) {
          handleClose()
          toast.success('Ambiente atualizado com sucesso!')
          setRefresh(!refresh)
        }
      })
      .catch(() => {
        handleClose()
        toast.error('Erro ao atualizado ambiente, tente novamente mais tarde')
      })
  }

  useEffect(() => {
    if (!open) reset()

    // if (environment?.data) setValue('name', environment?.data?.name)
  }, [reset, open, environment, setValue])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Editar Ambiente
      </DialogTitle>
      <form noValidate autoComplete='off'>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            Digite o nome atualizado do ambiente
          </DialogContentText>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4} md>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Nome'
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Nome do Ambiente'
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditEnvironment
