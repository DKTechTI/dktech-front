import { useState } from 'react'

import { Button, TableCell, TableRow, Typography } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'

import { Draggable } from 'react-beautiful-dnd'

import toast from 'react-hot-toast'

import { useActionsDnD } from 'src/hooks/useActionsDnD'

import ActionsEditButton from '../DeviceConfig/Keypad/ActionsEditButton'
import DialogAlert from 'src/@core/components/dialogs/dialog-alert'

import { api } from 'src/services/api'

interface DraggableItemProps {
  row: any
  index: number
}

const DraggableItem = ({ row, index }: DraggableItemProps) => {
  const { setActions, actions } = useActionsDnD()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [actionId, setActionId] = useState('')

  const handleConfirmDeleteAction = (id: string) => {
    api
      .delete(`/projectSceneActions/${id}`)
      .then(response => {
        if (response.status === 200) {
          setActions(actions.filter((action: any) => action.id !== id))
          setDeleteDialogOpen(false)
          toast.success('Ação deletada com sucesso!')
        }
      })
      .catch(() => {
        setDeleteDialogOpen(false)
        toast.error('Erro ao deletar ação, tenta novamente mais tarde!')
      })
  }

  return (
    <>
      <DialogAlert
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        question='Você tem certeza que deseja deletar esta ação?'
        description='Esta ação não podera ser desfeita'
        handleConfirmDelete={() => handleConfirmDeleteAction(actionId)}
      />

      <Draggable key={row.name} draggableId={row.name} index={index}>
        {provider => (
          <TableRow {...provider.draggableProps} ref={provider.innerRef}>
            <TableCell {...provider.dragHandleProps}>
              <Typography>
                {row.name}: {row.action}
              </Typography>
            </TableCell>
            <TableCell align='right'>
              <ActionsEditButton />
            </TableCell>
            <TableCell align='right'>
              <Button
                onClick={() => {
                  setActionId(row.id)
                  setDeleteDialogOpen(true)
                }}
              >
                <IconifyIcon fontSize='1.75rem' icon='tabler:trash' />
              </Button>
            </TableCell>
          </TableRow>
        )}
      </Draggable>
    </>
  )
}

export default DraggableItem
