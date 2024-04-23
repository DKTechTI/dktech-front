import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import useGetDataApi from 'src/hooks/useGetDataApi'

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
  projectSceneId: null | string
  setProjectSceneId: (value: string | null) => void
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
  projectSceneId: null,
  setProjectSceneId: () => null,
  draggedItem: null,
  beginDrag: () => null,
  endDrag: () => null
}

const ActionsDnDContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const ActionsDnDProvider = ({ children }: Props) => {
  const router = useRouter()

  const { id } = router.query

  const [actions, setActions] = useState<any[]>([])
  const [projectSceneId, setProjectSceneId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null)

  const {
    data,
    loading: loadingActions,
    refresh: refreshActions,
    setRefresh: setRefreshActions
  } = useGetDataApi<any>({
    url: `/projectSceneActions/by-project/${id}/by-scene/${projectSceneId}`,
    callInit: Boolean(id) && Boolean(projectSceneId)
  })

  const beginDrag = (item: DraggableItem) => {
    setDraggedItem(item)
  }

  const endDrag = () => {
    setDraggedItem(null)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    if (actions) {
      const tempData = Array.from(actions)
      const [sourceData] = tempData.splice(result.source.index, 1)
      tempData.splice(result.destination.index, 0, sourceData)
      setActions(tempData)
    }
  }

  useEffect(() => {
    if (!projectSceneId) return setActions([])

    if (data?.data && data.data.length > 0) return setActions(data?.data)

    setActions([])
  }, [data, projectSceneId])

  return (
    <ActionsDnDContext.Provider
      value={{
        actions,
        setActions,
        loadingActions,
        refreshActions,
        setRefreshActions,
        projectSceneId,
        setProjectSceneId,
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
