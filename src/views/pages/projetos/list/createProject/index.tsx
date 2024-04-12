import { Fragment, useCallback, useEffect, useState } from 'react'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import CustomTextField from 'src/@core/components/mui/text-field'
import { useAuth } from 'src/hooks/useAuth'
import useGetDataApi from 'src/hooks/useGetDataApi'
import { Box, MenuItem } from '@mui/material'
import { ClientDataProps } from 'src/types/clients'

import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

interface CreateProjectProps {
  open: boolean
  handleClickClose: () => void
  handleToggleOpen: () => void
  refresh: boolean
  setRefresh: (refresh: boolean) => void
}

const schema = yup.object().shape({
  name: yup.string().required('Nome do projeto é obrigatório'),
  status: yup.string().required('Status do projeto é obrigatório'),
  clientId: yup.string().required('Cliente é obrigatório')
})

interface FormData {
  name: string
  status: string
  clientId: string
}

const CreateProject = ({ handleClickClose, handleToggleOpen, open, setRefresh, refresh }: CreateProjectProps) => {
  const router = useRouter()

  const { user } = useAuth()

  const { data } = useGetDataApi<ClientDataProps>({ url: `/clients/by-reseller/${user?.id}`, callInit: open })

  const [createdProject, setCreatedProject] = useState<boolean>(false)
  const [projectId, setProjectId] = useState<string>('')

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      status: 'DRAFT',
      clientId: ''
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (formData: FormData) => {
    api
      .post('/projects', formData)
      .then(response => {
        if (response.status === 201) {
          setProjectId(response.data.data._id)
          setCreatedProject(true)
        }
      })
      .catch(() => {
        handleToggleOpen()
        toast.error('Erro ao criar projeto')
      })
  }

  const handleClickConfigProject = () => {
    router.push(`/projetos/configurar-projeto/${projectId}`)
  }

  const handleClickCancelConfigProject = () => {
    reset()
    handleClickClose()
    toast.success('Projeto adicionado com sucesso')
    setRefresh(!refresh)
  }

  const handleOpen = useCallback(() => {
    reset()
  }, [reset])

  useEffect(() => {
    handleOpen()
    setCreatedProject(false)
  }, [handleOpen, handleToggleOpen])

  return (
    <Fragment>
      <Dialog open={open}>
        {!createdProject && (
          <Box
            sx={{
              minWidth: { xs: 'auto', sm: 330 }
            }}
          >
            <DialogTitle>Nome do Projeto</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <DialogContentText sx={{ mb: 3 }}>Digite o nome do projeto no campo abaixo</DialogContentText>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Nome do Projeto'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Nome do Projeto'
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
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
                    <MenuItem value='DRAFT'>Não publicado</MenuItem>
                  </CustomTextField>
                )}
              />
              <Controller
                name='clientId'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Cliente'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.clientId)}
                    {...(errors.clientId && { helperText: errors.clientId.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    {data?.data.map(client => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
              <Button onClick={handleClickClose}>cancelar</Button>
              <Button onClick={handleSubmit(onSubmit)}>Adicionar</Button>
            </DialogActions>
          </Box>
        )}
        {createdProject && (
          <Box
            sx={{
              minWidth: { xs: 'auto', sm: 330 }
            }}
          >
            <DialogTitle>Deseja configurar o projeto?</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <DialogContentText sx={{ mb: 3 }}>Escolha uma das opções abaixo</DialogContentText>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
              <Button onClick={handleClickCancelConfigProject}>Não</Button>
              <Button onClick={handleClickConfigProject}>Sim</Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>
    </Fragment>
  )
}

export default CreateProject
