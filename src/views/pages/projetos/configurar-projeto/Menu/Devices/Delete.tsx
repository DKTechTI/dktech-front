import { Dispatch, Fragment, memo, SetStateAction } from 'react'

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
  deviceType?: 'INPUT' | 'OUTPUT' | 'INOUT' | null
}

const DeleteDevice = memo(
  ({ id, open, question, setOpen, description, handleClose, deviceType }: DeleteDeviceProps) => {
    const { keyId, setKeyId } = useDeviceKeys()
    const { handleErrorResponse } = useErrorHandling()
    const { setRefreshMenu, refreshMenu } = useProjectMenu()
    const { projectDeviceId, setProjectDeviceId } = useProject()
    const { setRefreshActions, refreshActions } = useActionsDnD()

    const handleCheckProjectDeviceExistsOnDevice = async (deviceId: string, projectDeviceId: string) => {
      const response = await api
        .get(`/projectDevices/${deviceId}`)
        .then(response => {
          if (response.status === 200) {
            const indexMenuDevices = response.data.data.indexMenuDevices

            for (const keyDeviceType in indexMenuDevices) {
              if (indexMenuDevices.hasOwnProperty(keyDeviceType)) {
                const boardIndex = indexMenuDevices[keyDeviceType]

                for (const index in boardIndex) {
                  if (boardIndex.hasOwnProperty(index)) {
                    for (const device in boardIndex[index]) {
                      if (boardIndex[index].hasOwnProperty(device)) {
                        const currentDeviceId = boardIndex[index][device]

                        if (projectDeviceId && currentDeviceId === projectDeviceId) return true
                      }
                    }
                  }
                }
              }
            }

            return false
          }
        })
        .catch(() => {
          toast.error('Erro ao verificar se o dispositivo está em uso.')

          return false
        })

      if (response) {
        return response
      }

      return false
    }

    const handleCheckActionsAfterRequest = (deviceId: string, projectDeviceId: string, deviceExists: boolean) => {
      if (projectDeviceId === deviceId || deviceExists) setProjectDeviceId(null), keyId && setKeyId(null)

      if (deviceType === 'OUTPUT') setRefreshActions(!refreshActions)

      setRefreshMenu(!refreshMenu)
    }

    const handleConfirmDelete = async (deviceId: string) => {
      let deviceExists = false

      if (deviceType === 'INOUT') deviceExists = await handleCheckProjectDeviceExistsOnDevice(deviceId, projectDeviceId)

      api
        .delete(`/projectDevices/${deviceId}`)
        .then(response => {
          if (response.status === 200) {
            handleCheckActionsAfterRequest(deviceId, projectDeviceId, deviceExists)

            toast.success('Dispositivo deletado com sucesso!')
          }
        })
        .catch(error => {
          handleErrorResponse({
            error: error,
            errorReference: projectDevicesErrors,
            defaultErrorMessage: 'Erro ao deletar dispositivo.'
          })
        })
        .finally(() => handleClose?.())
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
)

export default DeleteDevice
