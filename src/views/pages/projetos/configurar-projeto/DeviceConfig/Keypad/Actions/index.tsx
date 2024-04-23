import { Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import DroppableArea from '../../../DroppableArea'
import DraggableAction from './DraggableAction'

interface ActionsProps {
  actions: any[]
}

export default function Actions({ actions }: ActionsProps) {
  return (
    <TableContainer sx={{ minWidth: 300, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ação</TableCell>
            <TableCell align='right'>Editar</TableCell>
            <TableCell align='right'>Deletar</TableCell>
          </TableRow>
        </TableHead>
        <DroppableArea>
          {actions && actions.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align='center'>
                Nenhuma ação configurada
              </TableCell>
            </TableRow>
          )}
          {actions.map((row: any, index: number) => (
            <DraggableAction key={row._id} row={row} index={index} />
          ))}
        </DroppableArea>
      </Table>
    </TableContainer>
  )
}
