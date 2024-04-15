import { Dispatch, Fragment, SetStateAction } from 'react'

import { useProjectMenu } from 'src/hooks/useProjectMenu'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import toast from 'react-hot-toast'

import { api } from 'src/services/api'

interface DeleteEnvironmentProps {
  id: string
  question: string
  description?: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteEnvironment = ({ id, open, setOpen, description, question }: DeleteEnvironmentProps) => {
  const { setRefreshMenu, refreshMenu } = useProjectMenu()

  const handleConfirmDelete = (environmentId: string) => {
    api
      .delete(`/projectEnvironments/${environmentId}`)
      .then(response => {
        if (response.status === 200) {
          setRefreshMenu(!refreshMenu)
          toast.success('Ambiente deletado com sucesso!')
        }
      })
      .catch(() => {
        toast.error('Erro ao deletar ambiente!')
      })
  }

  return (
    <Fragment>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{question}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => setOpen(false)}>Não</Button>
          <Button
            onClick={() => {
              handleConfirmDelete(id)
              setOpen(false)
            }}
          >
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DeleteEnvironment
