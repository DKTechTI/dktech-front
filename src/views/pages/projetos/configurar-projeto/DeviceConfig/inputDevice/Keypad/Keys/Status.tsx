import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme
} from '@mui/material'

import toast from 'react-hot-toast'

import { useForm, useFieldArray } from 'react-hook-form'

import { api } from 'src/services/api'

import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesKeysErrors from 'src/errors/projectDevicesKeysErrors'

interface KeyStatusProps {
  [key: string]: string
}

const keyStatusObj: KeyStatusProps = {
  ACTIVE: '#4caf50',
  INACTIVE: '#ef5350'
}

interface FormData {
  keys: {
    _id: string
    projectId: string
    projectDeviceId: string
    environmentId: string
    name: string
    moduleType: string
    keyType: string
    status: string
  }[]
}

interface StatusProps {
  keys: any[]
  open: boolean
  handleClose: () => void
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const Status = ({ keys, handleClose, open, refresh, setRefresh }: StatusProps) => {
  const theme = useTheme()
  const { handleErrorResponse } = useErrorHandling()

  const [keysIndexUpdated, setKeysIndexUpdated] = useState<number[]>([])

  const { control, handleSubmit, reset } = useForm({
    values: {
      keys: keys
    } as FormData,
    mode: 'onBlur'
  })

  const { fields, update } = useFieldArray({
    control,
    name: 'keys'
  })

  const handleSelectKey = (index: number) => {
    try {
      update(index, {
        ...fields[index],
        status: fields[index].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      })
      if (!keysIndexUpdated.includes(index)) setKeysIndexUpdated([...keysIndexUpdated, index])
    } catch (error) {
      toast.error('Erro ao atualizar status da tecla, tente novamente mais tarde')
    }
  }

  const onSubmit = (formData: FormData) => {
    const updateKey = async (data: any) => {
      return api.put(`/projectDeviceKeys/${data._id}`, {
        projectId: data.projectId,
        projectDeviceId: data.projectDeviceId,
        environmentId: data.environmentId,
        moduleType: data.moduleType,
        keyType: data.keyType,
        status: data.status,
        centralId: data.centralId
      })
    }

    const promisses = keysIndexUpdated.map(index => updateKey(formData.keys[index]))

    Promise.all(promisses)
      .then(() => {
        handleClose()
        setKeysIndexUpdated([])
        toast.success('Teclas atualizadas com sucesso!')
        setRefresh(!refresh)
      })
      .catch((error: any) => {
        handleClose()
        setKeysIndexUpdated([])
        handleErrorResponse({
          error: error,
          errorReference: projectDevicesKeysErrors,
          defaultErrorMessage: 'Erro ao atualizar teclas, tente novamente mais tarde.'
        })
      })
  }

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

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
        Status das Teclas
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Selecione as teclas que deseja ativar ou desativar (verdes = ativas, vermelhas = inativas)
        </DialogContentText>
        <List
          id='keysContainer'
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 3
          }}
        >
          {fields.map((key, index: number) => {
            return (
              <ListItem
                key={key.id}
                disablePadding
                sx={{
                  maxWidth: 300,
                  width: '100%',
                  margin: '0 auto',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: keyStatusObj[key?.status]
                }}
              >
                <ListItemButton
                  id='keyButton'
                  onClick={() => handleSelectKey(index)}
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  <ListItemText primary={key.name} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
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
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Status
