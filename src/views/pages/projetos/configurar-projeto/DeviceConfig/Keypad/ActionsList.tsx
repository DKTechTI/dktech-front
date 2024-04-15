import { Table, TableCell, TableHead, TableRow } from '@mui/material'

import DroppableArea from '../../DroppableArea'
import DraggableItem from '../../DraggableItem'
import { useActionsDnD } from 'src/hooks/useActionsDnD'

export default function ActionsList() {
  const { actions } = useActionsDnD()

  return (
    <Table sx={{ minWidth: 300 }} aria-label='simple table'>
      <TableHead>
        <TableRow>
          <TableCell>Ação</TableCell>
          <TableCell align='right'>Editar</TableCell>
          <TableCell align='right'>Deletar</TableCell>
        </TableRow>
      </TableHead>
      <DroppableArea>
        {actions.map((row: any, index: number) => (
          <DraggableItem key={row.name} row={row} index={index} />
        ))}
      </DroppableArea>
    </Table>
  )
}
