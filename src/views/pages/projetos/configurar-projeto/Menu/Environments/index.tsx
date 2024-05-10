import { useState } from 'react'

import { Box, Typography } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view/TreeItem'

import CloseIcon from '@mui/icons-material/Close'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { useProject } from 'src/hooks/useProject'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import CreateEnvironment from './Create'
import DeleteEnvironment from './Delete'
import AddInputDevice from './AddInputDevice'

import AddOutputDevice from './AddOutputDevice'
import EditEnvironment from './Edit'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

interface EnvironmentsProps {
  environments: any
}

const Environments = ({ environments }: EnvironmentsProps) => {
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

  return (
    <>
      <CreateEnvironment
        open={showDialog}
        handleClose={() => setShowDialog(false)}
        refresh={refreshMenu}
        setRefresh={setRefreshMenu}
      />

      <EditEnvironment
        environmentId={environmentId}
        open={showEditDialog}
        handleClose={() => setShowEditDialog(false)}
        refresh={refreshMenu}
        setRefresh={setRefreshMenu}
      />

      <DeleteEnvironment
        id={environmentId}
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        question={'Deseja realmente deletar este ambiente?'}
        description={
          'O ambiente pode estar conectado a dispositivos, deseja continuar? Esta ação não poderá ser desfeita!'
        }
      />

      <AddInputDevice
        environmentId={environmentId}
        environmentName={environmentName}
        open={showAddInputDevice}
        handleClose={() => setShowAddInputDevice(false)}
        refresh={refreshMenu}
        setRefresh={setRefreshMenu}
      />

      <AddOutputDevice
        environmentId={environmentId}
        environmentName={environmentName}
        open={showAddOutputDevice}
        handleClose={() => setShowAddOutputDevice(false)}
        refresh={refreshMenu}
        setRefresh={setRefreshMenu}
      />

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
        {environments.map((environment: any) => {
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
                icon={
                  <ExitToAppIcon
                    sx={{
                      transform: 'rotate(180deg)'
                    }}
                  />
                }
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
                {environment.inputs.map((input: any, index: number) => {
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
                icon={<ExitToAppIcon />}
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
                      {environment.outputs.map((output: any, index: number) => (
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
}

export default Environments
