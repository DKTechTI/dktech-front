import { FormEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  DialogActions,
  Button,
  ListItem,
  ListItemText,
  List,
  ListSubheader,
  useTheme
} from '@mui/material'

import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'
import IconifyIcon from 'src/@core/components/icon'
import { verifyObjectErrorsIsEmpty } from 'src/utils/verifyErrors'

const schema = yup.object().shape({
  environments: yup
    .array()
    .of(yup.object().shape({ name: yup.string().required('Nome do ambiente obrigatório') }))
    .min(1, 'Adicione pelo menos um ambiente')
})

interface EnvironmentProps {
  projectId: string
  name: string
}

interface FormData {
  environments: EnvironmentProps[]
}

interface EditProfileProps {
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const CreateEnvironment = ({ open, handleClose, refresh, setRefresh }: EditProfileProps) => {
  const theme = useTheme()
  const router = useRouter()

  const { id: projectId } = router.query

  const [environmentName, setEnvironmentName] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      environments: [] as FormData['environments']
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'environments'
  })

  const handleSetName = (value: string) => {
    setEnvironmentName(value)
    if (errors.environments) clearErrors('environments')
  }

  const handlePressEnter = (event: FormEvent, environmentName: string, projectId: string, length: number) => {
    event.preventDefault()

    if (environmentName.trim() === '')
      return setError(`environments.${length}.name`, { type: 'manual', message: 'Nome do ambiente obrigatório' })

    append({ projectId: projectId, name: environmentName })
    setEnvironmentName('')
  }

  const onSubmit = (formData: FormData) => {
    const createEnvironment = async (data: any) => {
      return api.post('/projectEnvironments', data)
    }

    const promises = formData.environments.map(environment => createEnvironment(environment))

    Promise.all(promises)
      .then(() => {
        handleClose()
        toast.success('Ambientes adicionados com sucesso!')
        setRefresh(!refresh)
      })
      .catch(() => {
        handleClose()
        toast.error('Erro ao adicionar ambientes, tente novamente mais tarde')
      })
  }

  useEffect(() => {
    reset()
  }, [reset, open])

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
        Adicionar Ambiente
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Digite o Nome do Ambiente
        </DialogContentText>
        <form
          noValidate
          autoComplete='off'
          onSubmit={e => handlePressEnter(e, environmentName, projectId as string, fields.length)}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4} md>
              <CustomTextField
                fullWidth
                autoFocus
                label='Nome'
                value={environmentName}
                onChange={e => handleSetName(e.target.value)}
                placeholder='Nome do Ambiente'
                error={Boolean(errors.environments && errors.environments[fields.length]?.name)}
                helperText={errors.environments && errors.environments[fields.length]?.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <List
                sx={{
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 300
                }}
                subheader={<li />}
              >
                <ListSubheader>Ambientes</ListSubheader>
                {(!fields || fields.length === 0) && (
                  <ListItem
                    sx={{
                      borderBottom: `1px solid ${
                        verifyObjectErrorsIsEmpty(errors)
                          ? theme.palette.divider
                          : errors.environments?.message
                          ? theme.palette.error.main
                          : theme.palette.divider
                      }`
                    }}
                  >
                    <ListItemText
                      primary={
                        verifyObjectErrorsIsEmpty(errors) ? 'Nenhum Ambiente' : errors.environments?.message || ''
                      }
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: verifyObjectErrorsIsEmpty(errors) ? theme.palette.primary : theme.palette.error.main
                        } as unknown as string
                      }}
                    />
                  </ListItem>
                )}
                {fields.map((item, index) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <ListItemText primary={item.name} />
                    <IconifyIcon
                      fontSize='1.75rem'
                      icon='tabler:trash'
                      onClick={() => remove(index)}
                      style={{
                        cursor: 'pointer'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
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
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateEnvironment
