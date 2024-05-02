import React, { createContext, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import { DragDropContext } from 'react-beautiful-dnd'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import { api } from 'src/services/api'

import toast from 'react-hot-toast'

import { handleCheckOperationType } from 'src/utils/actions'

type DraggableItem = {
  id: string
  type: string
}

type ChildProps = {
  actions: any
  setActions: any
  loadingActions: any
  refreshActions: any
  setRefreshActions: any
  projectSceneId: any
  setProjectSceneId: any
  draggedItem: any
  beginDrag: any
  endDrag: any
}

type actionsDnDValuesType = {
  actions: null | any
  setActions: (value: any) => void
  loadingActions: boolean
  refreshActions: boolean
  setRefreshActions: (value: boolean) => void
  orderActions: any
  setOrderActions: (value: any) => void
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
  orderActions: null,
  setOrderActions: () => null,
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

  const { menu } = useProjectMenu()
  const { keyId } = useDeviceKeys()

  const { id } = router.query

  const [actions, setActions] = useState<any[]>([])
  const [orderActions, setOrderActions] = useState<any>(null)
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

  const handleUpdateIndex = async (actions: any[], result: any) => {
    const actionsRef = actions

    try {
      const tempData = Array.from(actions)
      const [sourceData] = tempData.splice(result.source.index, 1)
      tempData.splice(result.destination.index, 0, sourceData)
      setActions(tempData)

      const responseUpdatedIndex = await api.put(`/projectSceneActions/update-index/${result.draggableId}`, {
        to: result.destination.index
      })

      if (responseUpdatedIndex.status === 200) return toast.success('Ordem das ações atualizada com sucesso')
    } catch (error) {
      setActions(actionsRef)

      return toast.error('Erro ao atualizar a ordem das ações, tente novamente mais tarde')
    }
  }

  const handleCreateAction = async (action: any) => {
    try {
      const draggedOutputId = action.draggableId

      const draggedOutput = menu.environments
        .map((environment: any) => {
          if (environment.outputs) {
            const output = environment.outputs.find((output: any) => output.projectDeviceKeyId === draggedOutputId)
            if (output) {
              return { ...output, environmentId: environment.environmentId }
            }
          }

          return null
        })
        .filter(Boolean)[0]

      const response = await api.get(`/projectDevices/${draggedOutput.projectDeviceId}`)
      const data = response.data

      const initialValue = data?.data.initialValue
      const operationType = handleCheckOperationType(initialValue)

      if (!initialValue && !operationType)
        return toast.error('Erro ao buscar informações do dispositivo, tente novamente mais tarde')

      const reqBody = {
        projectId: id as string,
        projectSceneId: projectSceneId,
        projectDeviceKeyId: keyId,
        actionProjectDeviceKeyId: draggedOutput.projectDeviceKeyId,
        boardId: draggedOutput.boardId,
        order: action.destination.index,
        name: draggedOutput.deviceKeyName,
        type: 'EXTERNAL',
        ...(operationType === 'RELE' && { actionValueReles: initialValue }),
        ...(operationType === 'ENGINE' && { actionValueEngine: initialValue }),
        ...(operationType === 'DIMMER' && { actionValueDimmer: initialValue })
      }

      const responseCreate = await api.post('/projectSceneActions', reqBody)

      if (responseCreate.status === 201) toast.success('Ação criada com sucesso')

      const newAction = { ...reqBody, _id: responseCreate.data.data._id }

      const tempData = Array.from(actions)
      tempData.splice(action.destination.index, 0, newAction)

      return setActions(tempData)
    } catch (error) {
      return toast.error('Erro ao criar ação, tente novamente mais tarde')
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    if (result.source.droppableId === 'outputs') return handleCreateAction(result)

    if (result.source.droppableId === 'updateIndex') return handleUpdateIndex(actions, result)
  }

  useEffect(() => {
    if (!projectSceneId) return setActions([])

    if (data?.data && data.data.length > 0) {
      const arrayActions = data.data

      if (orderActions) {
        const idToIndexMap: { [key: string]: number } = {}

        Object.entries(orderActions).forEach(([index, id]) => {
          idToIndexMap[id as string] = parseInt(index as string)
        })

        arrayActions.sort((a: any, b: any) => idToIndexMap[a._id] - idToIndexMap[b._id])
      }

      return setActions(arrayActions)
    }

    setActions([])
  }, [data, orderActions, projectSceneId])

  const memoizedChildren = useMemo(() => {
    return React.Children.map(children, child => {
      if (React.isValidElement<ChildProps>(child)) {
        return React.cloneElement<ChildProps>(child, {
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
        })
      }

      return child
    })
  }, [children, actions, loadingActions, refreshActions, setRefreshActions, projectSceneId, draggedItem])

  return (
    <ActionsDnDContext.Provider
      value={{
        actions,
        setActions,
        loadingActions,
        refreshActions,
        setRefreshActions,
        orderActions,
        setOrderActions,
        projectSceneId,
        setProjectSceneId,
        draggedItem,
        beginDrag,
        endDrag
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>{memoizedChildren}</DragDropContext>
    </ActionsDnDContext.Provider>
  )
}

export { ActionsDnDProvider, ActionsDnDContext }
