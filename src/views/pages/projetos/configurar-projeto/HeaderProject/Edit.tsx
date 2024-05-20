import { useEffect } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogContentText, Grid, DialogActions, Button } from '@mui/material'

import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'

import projectErrors from 'src/errors/projectErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const schema = yup.object().shape({
  name: yup.string().required('Nome do projeto obrigatório')
})

interface FormData {
  _id: string
  clientId: string
  name: string
}

interface EditProps {
  data: any
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const Edit = ({ data, handleClose, open, refresh, setRefresh }: EditProps) => {
  const { handleErrorResponse } = useErrorHandling()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    values: data as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleFormatdata = (data: any) => {
    if (data) {
      return {
        clientId: data.clientId,
        name: data.name
      }
    }
  }

  const onSubmit = (formData: FormData) => {
    const formattedData = handleFormatdata(formData)
    api
      .put(`/projects/${formData._id}`, formattedData)
      .then(response => {
        if (response.status === 201) {
          handleClose()
          setRefresh(!refresh)
          toast.success('Projeto atualizado com sucesso!')
        }
      })
      .catch(error => {
        handleClose()
        handleErrorResponse({
          error: error,
          errorReference: projectErrors,
          defaultErrorMessage: 'Erro ao atualizar projeto, tente novamente mais tarde.'
        })
      })
  }

  useEffect(() => {
    if (!open) reset()
  }, [reset, open, setValue])

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
        Editar Projeto
      </DialogTitle>
      <form noValidate autoComplete='off'>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            Digite o nome atualizado do projeto
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
                    placeholder='Nome do Projeto'
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

export default Edit
