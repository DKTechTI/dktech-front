import { Dispatch, Fragment, SetStateAction } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import toast from 'react-hot-toast'

import { api } from 'src/services/api'

import { useProjectMenu } from 'src/hooks/useProjectMenu'
import useErrorHandling from 'src/hooks/useErrorHandling'
import projectDevicesErrors from 'src/errors/projectDevicesErrors'
import { useProject } from 'src/hooks/useProject'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'
import { useActionsDnD } from 'src/hooks/useActionsDnD'

interface DeleteDeviceProps {
  id: string
  question: string
  description?: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleClose?: () => void
  deviceType?: 'INPUT' | 'OUTPUT' | null
}

const DeleteDevice = ({ id, open, question, setOpen, description, handleClose, deviceType }: DeleteDeviceProps) => {
  const { handleErrorResponse } = useErrorHandling()
  const { setRefreshMenu, refreshMenu } = useProjectMenu()
  const { projectDeviceId, setProjectDeviceId } = useProject()
  const { keyId, setKeyId } = useDeviceKeys()
  const { setRefreshActions, refreshActions } = useActionsDnD()

  const handleConfirmDelete = (deviceId: string) => {
    api
      .delete(`/projectDevices/${deviceId}`)
      .then(response => {
        if (response.status === 200) {
          if (projectDeviceId === id) setProjectDeviceId(null), keyId && setKeyId(null)
          deviceType === 'OUTPUT' && setRefreshActions(!refreshActions)
          setRefreshMenu(!refreshMenu)
          handleClose?.()
          toast.success('Dispositivo deletado com sucesso!')
        }
      })
      .catch(error => {
        handleClose?.()
        handleErrorResponse({
          error: error,
          errorReference: projectDevicesErrors,
          defaultErrorMessage: 'Erro ao deletar dispositivo.'
        })
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

export default DeleteDevice
