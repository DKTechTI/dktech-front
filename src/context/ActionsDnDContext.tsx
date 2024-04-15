import { createContext, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

type DraggableItem = {
  id: string
  type: string
}

type actionsDnDValuesType = {
  actions: null | any
  setActions: (value: any) => void
  loadingActions: boolean
  refreshActions: boolean
  setRefreshActions: (value: boolean) => void
  draggedItem: null | any
  beginDrag: (value: any) => void
  endDrag: () => void
}

const defaultProvider: actionsDnDValuesType = {
  actions: null,
  setActions: () => null,
  loadingActions: true,
  refreshActions: false,
  setRefreshActions: () => Boolean,
  draggedItem: null,
  beginDrag: () => null,
  endDrag: () => null
}

const ActionsDnDContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const acoes = [
  {
    id: 1,
    name: 'luz mesa jantar',
    order: 1,
    type: 'dimmer',
    action: '70'
  },
  {
    id: 2,
    name: 'delay',
    order: 2,
    type: null,
    action: '0.2'
  },
  {
    id: 3,
    name: 'luz corredor',
    order: 3,
    type: 'rele',
    action: 'on'
  }
]

const ActionsDnDProvider = ({ children }: Props) => {
  const [actions, setActions] = useState<any>(acoes)
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null)

  const beginDrag = (item: DraggableItem) => {
    setDraggedItem(item)
  }

  const endDrag = () => {
    setDraggedItem(null)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const tempData = Array.from(actions)
    const [sourceData] = tempData.splice(result.source.index, 1)
    tempData.splice(result.destination.index, 0, sourceData)
    setActions(tempData)
  }

  return (
    <ActionsDnDContext.Provider
      value={{
        actions,
        setActions,
        loadingActions: false,
        refreshActions: false,
        setRefreshActions: () => Boolean,
        draggedItem,
        beginDrag,
        endDrag
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
    </ActionsDnDContext.Provider>
  )
}

export { ActionsDnDProvider, ActionsDnDContext }
