import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import { DragDropContext } from 'react-beautiful-dnd'

import { useDeviceKeys } from 'src/hooks/useDeviceKeys'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import { api } from 'src/services/api'

import toast from 'react-hot-toast'

import useErrorHandling from 'src/hooks/useErrorHandling'
import { handleCheckItemsFrontAndBack, handleCheckOperationType } from 'src/utils/actions'
import projectSceneActionsErrors from 'src/errors/projectSceneActionsErrors'

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
  const { id } = router.query

  const { menu } = useProjectMenu()
  const { keyId } = useDeviceKeys()
  const { handleErrorResponse } = useErrorHandling()

  const [actions, setActions] = useState<any[]>([])
  const [orderActions, setOrderActions] = useState<any>(null)
  const [loadingActions, setLoadingActions] = useState<boolean>(true)
  const [refreshActions, setRefreshActions] = useState<boolean>(false)
  const [projectSceneId, setProjectSceneId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null)

  const beginDrag = (item: DraggableItem) => {
    setDraggedItem(item)
  }

  const endDrag = () => {
    setDraggedItem(null)
  }

  const handleSwapIndexToValue = (order: any, actions: any[]) => {
    function getKeyByValue(object: any, value: string) {
      return Object.keys(object).find(key => object[key] === value)
    }

    const sizeActions = Object.values(order).length

    const alignedObj = new Array(sizeActions).fill(null)

    actions.map(item => {
      const index = getKeyByValue(order, item._id)
      alignedObj[Number(index)] = item
    })

    return alignedObj
  }

  const handleGetActions = useCallback(async (projectSceneId: string, projectId: string) => {
    try {
      const [responseScene, responseActions] = await Promise.all([
        api.get(`/projectScenes/${projectSceneId}`),
        api.get(`/projectSceneActions/by-project/${projectId}/by-scene/${projectSceneId}`, {
          params: { perPage: 10000 }
        })
      ])

      if (responseScene.status === 200 && responseActions.status === 200) {
        const { data: dataScene } = responseScene
        const { data: actionsData } = responseActions

        const orderActions = dataScene.data.indexActions

        if (orderActions) return handleSwapIndexToValue(orderActions, actionsData.data)

        return []
      } else {
        setActions([])
        toast.error('Erro ao obter dados das ações ou da cena.')
      }
    } catch (error: any) {
      return error
    }
  }, [])

  const handleUpdateIndex = async (actions: any[], result: any) => {
    const actionsRef = actions

    try {
      const tempData = Array.from(actions)
      const [sourceData] = tempData.splice(result.source.index, 1)
      tempData.splice(result.destination.index, 0, sourceData)

      const checkActionDestination = handleCheckItemsFrontAndBack(tempData, result.destination.index, 'DELAY')

      if (!checkActionDestination)
        return toast.error('Não é possível atualizar as posições, delays não podem ficar em sequência.')

      const checkSourceActionDestination = handleCheckItemsFrontAndBack(tempData, result.source.index, 'DELAY')

      if (!checkSourceActionDestination)
        return toast.error('Não é possível atualizar as posições, delays não podem ficar em sequência.')

      setActions(tempData)

      const responseUpdatedIndex = await api.put(`/projectSceneActions/update-index/${result.draggableId}`, {
        to: result.destination.index
      })

      if (responseUpdatedIndex.status === 200) toast.success('Ordem das ações atualizada com sucesso')
    } catch (error: any) {
      setActions(actionsRef)
      handleErrorResponse({
        error: error,
        errorReference: projectSceneActionsErrors,
        defaultErrorMessage: 'Erro ao atualizar a ordem das ações, tente novamente mais tarde.'
      })
    }
  }

  const handleCreateAction = async (action: any) => {
    try {
      if (!projectSceneId) return toast.error('Selecione uma cena antes de adicionar uma ação')

      const draggedOutputId = action.draggableId

      const draggedOutput = menu?.environments
        .map(environment => {
          if (environment.outputs) {
            const output = environment.outputs.find((output: any) => output.projectDeviceKeyId === draggedOutputId)
            if (output) {
              return { ...output, environmentId: environment.environmentId }
            }
          }

          return null
        })
        .filter(Boolean)[0]

      if (!draggedOutput) return toast.error('Erro ao buscar informações do dispositivo, tente novamente mais tarde')

      const response = await api.get(`/projectDeviceKeys/${draggedOutput.projectDeviceKeyId}`)
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
        centralId: draggedOutput.centralId,
        order: action.destination.index,
        name: draggedOutput.deviceKeyName,
        type: 'EXTERNAL',
        ...(operationType === 'RELES' && { actionValueReles: initialValue }),
        ...(operationType === 'ENGINE' && { actionValueEngine: initialValue }),
        ...(operationType === 'DIMMER' && { actionValueDimmer: initialValue })
      }

      const responseCreate = await api.post('/projectSceneActions', reqBody)

      if (responseCreate.status === 201) {
        setRefreshActions(!refreshActions)
        toast.success('Ação criada com sucesso')
      }
    } catch (error: any) {
      handleErrorResponse({
        error: error,
        errorReference: projectSceneActionsErrors,
        defaultErrorMessage: 'Erro ao criar ação, tente novamente mais tarde.'
      })
    }
  }

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === 'outputs' && destination.droppableId !== source.droppableId)
      return handleCreateAction(result)

    if (source.droppableId === 'updateIndex') {
      if (destination.droppableId === source.droppableId && destination.index !== source.index)
        return handleUpdateIndex(actions, result)
    }
  }

  useEffect(() => {
    if (!projectSceneId) return setActions([])
    setLoadingActions(true)

    handleGetActions(projectSceneId, id as string)
      .then(response => setActions(response as any[]))
      .catch(error => {
        setActions([])
        handleErrorResponse({
          error: error,
          errorReference: projectSceneActionsErrors,
          defaultErrorMessage: 'Erro ao buscar ações, tente novamente mais tarde.'
        })
      })
      .finally(() => setLoadingActions(false))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, projectSceneId, refreshActions])

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
