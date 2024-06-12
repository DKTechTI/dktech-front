import { Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import DroppableArea from './DroppableArea'
import DraggableAction from './DraggableAction'
import { useEffect, useState } from 'react'

interface ActionsProps {
  actions: any[]
}

export default function Actions({ actions }: ActionsProps) {
  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowActions(true)
    }, 1000)
  }, [actions])

  return (
    <TableContainer sx={{ minWidth: 300, overflowX: 'auto', maxHeight: 500, overflowY: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ação</TableCell>
            <TableCell align='right'>Editar</TableCell>
            <TableCell align='right'>Deletar</TableCell>
          </TableRow>
        </TableHead>
        <DroppableArea>
          {!showActions ? (
            <TableRow>
              <TableCell colSpan={3}>Carregando...</TableCell>
            </TableRow>
          ) : actions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align='center'>
                Nenhuma ação configurada
              </TableCell>
            </TableRow>
          ) : (
            actions.map((row: any, index: number) => <DraggableAction key={row._id} row={row} index={index} />)
          )}
        </DroppableArea>
      </Table>
    </TableContainer>
  )
}
