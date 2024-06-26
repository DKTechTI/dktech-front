import { TableBody } from '@mui/material'
import { Droppable } from 'react-beautiful-dnd'

interface DroppableAreaProps {
  children: React.ReactNode
}

const DroppableArea = ({ children }: DroppableAreaProps) => {
  return (
    <Droppable droppableId='updateIndex'>
      {provider => (
        <TableBody ref={provider.innerRef} {...provider.droppableProps}>
          {children}
          {provider.placeholder}
        </TableBody>
      )}
    </Droppable>
  )
}

export default DroppableArea
