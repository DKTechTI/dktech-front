import { memo, useState } from 'react'

import { Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import EditNoteIcon from '@mui/icons-material/EditNote'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import IconifyIcon from 'src/@core/components/icon'

import { useProject } from 'src/hooks/useProject'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import EditEnvironment from './Edit'
import DeleteEnvironment from './Delete'
import CreateEnvironment from './Create'
import AddInputDevice from './AddInputDevice'
import AddOutputDevice from './AddOutputDevice'

import { Draggable, Droppable } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'

import { EnvironmentProps } from 'src/types/menu'

interface EnvironmentsProps {
  environments: EnvironmentProps[]
}

const Environments = memo(({ environments }: EnvironmentsProps) => {
  const { setProjectDeviceId } = useProject()
  const { refreshMenu, setRefreshMenu } = useProjectMenu()
  const { setKeyId } = useDeviceKeys()

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const [environmentId, setEnvironmentId] = useState<string>('')
  const [environmentName, setEnvironmentName] = useState<string>('')

  const [showAddInputDevice, setShowAddInputDevice] = useState<boolean>(false)
  const [showAddOutputDevice, setShowAddOutputDevice] = useState<boolean>(false)

  const handleCheckEnvironmentEmpty = (environment: EnvironmentProps) => {
    return environment.inputs.length === 0 && environment.outputs.length === 0
  }

  return (
    <>
      {showDialog && (
        <CreateEnvironment
          open={showDialog}
          handleClose={() => setShowDialog(false)}
          refresh={refreshMenu}
          setRefresh={setRefreshMenu}
        />
      )}

      {showEditDialog && (
        <EditEnvironment
          environmentId={environmentId}
          open={showEditDialog}
          handleClose={() => setShowEditDialog(false)}
          refresh={refreshMenu}
          setRefresh={setRefreshMenu}
        />
      )}

      {showDeleteDialog && (
        <DeleteEnvironment
          id={environmentId}
          open={showDeleteDialog}
          setOpen={setShowDeleteDialog}
          question={'Deseja realmente deletar este ambiente?'}
          description={'Esta ação não poderá ser desfeita, deseja continuar?'}
        />
      )}

      {showAddInputDevice && (
        <AddInputDevice
          environmentId={environmentId}
          environmentName={environmentName}
          open={showAddInputDevice}
          handleClose={() => setShowAddInputDevice(false)}
          refresh={refreshMenu}
          setRefresh={setRefreshMenu}
        />
      )}

      {showAddOutputDevice && (
        <AddOutputDevice
          environmentId={environmentId}
          environmentName={environmentName}
          open={showAddOutputDevice}
          handleClose={() => setShowAddOutputDevice(false)}
          refresh={refreshMenu}
          setRefresh={setRefreshMenu}
        />
      )}

      <TreeItem
        nodeId='3'
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography component={'span'} variant={'h6'}>
              Ambientes
            </Typography>
            <AddCircleIcon
              onClick={e => {
                e.stopPropagation()
                setShowDialog(true)
              }}
              sx={{
                fontSize: 16
              }}
            />
          </Box>
        }
      >
        {environments.map(environment => {
          return (
            <TreeItem
              key={environment.environmentId}
              nodeId={environment.environmentId}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography component={'span'} variant={'h6'}>
                    {environment.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditNoteIcon
                      sx={{ fontSize: 18 }}
                      onClick={e => {
                        e.stopPropagation()
                        setEnvironmentId(environment.environmentId)
                        setShowEditDialog(true)
                      }}
                    />
                    <CloseIcon
                      onClick={e => {
                        e.stopPropagation()
                        const isEmpty = handleCheckEnvironmentEmpty(environment)

                        if (!isEmpty) return toast.error('O ambiente não está vazio, remova os dispositivos antes!')

                        setEnvironmentId(environment.environmentId)
                        setShowDeleteDialog(true)
                      }}
                      sx={{ fontSize: 16 }}
                    />
                  </Box>
                </Box>
              }
            >
              <TreeItem
                key={environment.environmentId + 'entradas'}
                nodeId={environment.environmentId + 'entradas'}
                icon={<IconifyIcon icon='material-symbols:input-rounded' width='1.2em' height='1.2em' />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography component={'span'} variant={'h6'}>
                      Entradas
                    </Typography>
                    <AddCircleIcon
                      onClick={e => {
                        e.stopPropagation()
                        setEnvironmentId(environment.environmentId)
                        setEnvironmentName(environment.name)
                        setShowAddInputDevice(true)
                      }}
                      sx={{
                        fontSize: 16
                      }}
                    />
                  </Box>
                }
              >
                {environment.inputs.map((input, index: number) => {
                  return (
                    <TreeItem
                      key={input.projectDeviceId + input.projectDeviceKeyId}
                      nodeId={input.projectDeviceId + input.projectDeviceKeyId}
                      label={
                        <Typography component={'span'} variant={'h6'}>
                          [{index + 1}] {input.deviceName} - {input.deviceKeyName}
                        </Typography>
                      }
                      onClick={() => {
                        setProjectDeviceId(input.projectDeviceId)
                        setKeyId(input.projectDeviceKeyId)
                      }}
                    ></TreeItem>
                  )
                })}
              </TreeItem>
              <TreeItem
                key={environment.environmentId + 'saidas'}
                nodeId={environment.environmentId + 'saidas'}
                icon={<IconifyIcon icon='material-symbols:output-rounded' width='1.2rem' height='1.2rem' />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography component={'span'} variant={'h6'}>
                      Saídas
                    </Typography>
                    <AddCircleIcon
                      onClick={e => {
                        e.stopPropagation()
                        setEnvironmentId(environment.environmentId)
                        setEnvironmentName(environment.name)
                        setShowAddOutputDevice(true)
                      }}
                      sx={{
                        fontSize: 16
                      }}
                    />
                  </Box>
                }
              >
                <Droppable droppableId='outputs'>
                  {provided => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {environment.outputs.map((output, index: number) => (
                        <Draggable
                          key={output.projectDeviceKeyId}
                          draggableId={output.projectDeviceKeyId}
                          index={index}
                        >
                          {provided => (
                            <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <TreeItem
                                nodeId={output.projectDeviceId + output.projectDeviceKeyId}
                                label={
                                  <Typography component={'span'} variant={'h6'}>
                                    [{index + 1}] {output.deviceName} - {output.deviceKeyName}
                                  </Typography>
                                }
                                onClick={() => {
                                  setProjectDeviceId(output.projectDeviceId)
                                }}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </TreeItem>
            </TreeItem>
          )
        })}
      </TreeItem>
    </>
  )
})

export default Environments
