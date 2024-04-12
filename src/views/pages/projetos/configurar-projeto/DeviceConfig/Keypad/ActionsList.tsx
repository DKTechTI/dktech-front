import React, { useState } from 'react'

import { Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'

import ActionsEditButton from './ActionsEditButton'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import DialogAlert from 'src/@core/components/dialogs/dialog-alert'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'

interface ActionsListProps {
  data: any[]
}

export default function ActionsList({ data }: ActionsListProps) {
  const [rows, setRows] = useState(data)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [actionId, setActionId] = useState('')

  const handleDragEnd = (e: any) => {
    if (!e.destination) return
    const tempData = Array.from(rows)
    const [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    setRows(tempData)
  }

  const handleConfirmDeleteAction = (id: string) => {
    api
      .delete(`/projectSceneActions/${id}`)
      .then(response => {
        if (response.status === 200) {
          setRows(rows.filter(row => row.id !== id))
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Table sx={{ minWidth: 300 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Ação</TableCell>
              <TableCell align='right'>Editar</TableCell>
              <TableCell align='right'>Deletar</TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId='droppable-1'>
            {provider => (
              <TableBody ref={provider.innerRef} {...provider.droppableProps}>
                {rows.map((row, index) => (
                  <Draggable key={row.name} draggableId={row.name} index={index}>
                    {provider => (
                      <TableRow key={row.name} {...provider.draggableProps} ref={provider.innerRef}>
                        <TableCell
                          {...provider.dragHandleProps}
                          sx={{
                            fontSize: '1rem'
                          }}
                        >
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
                ))}
                {provider.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </>
  )
}
