import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Typography, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import EditNoteIcon from '@mui/icons-material/EditNote'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { useProject } from 'src/hooks/useProject'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'
import { useProjectMenu } from 'src/hooks/useProjectMenu'

import IconifyIcon from 'src/@core/components/icon'

import { checkPortName } from 'src/utils/project'
import { verifyDeviceType } from 'src/utils/verifyDevice'

import DeleteDevice from './Delete'
import AddCentral from './AddCentral'
import EditCentral from './EditCentral'
import { api } from 'src/services/api'

interface CentralStatusType {
  [key: string]: string
}

const centralStatusObj: CentralStatusType = {
  true: '#28C76F',
  false: '#EA5455'
}

interface DevicesProps {
  devices: any
}

const Devices = ({ devices }: DevicesProps) => {
  const router = useRouter()
  const { id: projectId } = router.query

  const { setProjectDeviceId } = useProject()
  const { setKeyId, setProjectDeviceId: setProjectDeviceIdOnDeviceKeys } = useDeviceKeys()

  const { refreshMenu, setRefreshMenu } = useProjectMenu()

  const [showAddCentralDialog, setShowAddCentralDialog] = useState<boolean>(false)
  const [showEditCentralDialog, setShowEditCentralDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const [deviceId, setDeviceId] = useState<string>('')
  const [centralsStatus, setCentralsStatus] = useState<any[]>([])

  useEffect(() => {
    const fetchCentralsStatus = () => {
      const centralsCheck = devices.map((device: any) =>
        api.get('/mqtt/device-status', {
          params: {
            boardId: device.boardId,
            projectId: projectId
          }
        })
      )

      Promise.all(centralsCheck)
        .then(response => {
          const centralsChecked = devices.map((device: any, index: number) => ({
            [device.boardId]: response[index].data
          }))

          setCentralsStatus(centralsChecked)
        })
        .catch(() => {
          setCentralsStatus([])
        })
    }

    fetchCentralsStatus()

    const interval = setInterval(() => {
      fetchCentralsStatus()
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [devices, projectId, refreshMenu])

  return (
    <>
      <AddCentral
        open={showAddCentralDialog}
        handleClose={() => setShowAddCentralDialog(false)}
        refresh={refreshMenu}
        setRefresh={setRefreshMenu}
      />

      <EditCentral
        projectDeviceId={deviceId}
        open={showEditCentralDialog}
        handleClose={() => setShowEditCentralDialog(false)}
        refresh={refreshMenu}
        setRefresh={setRefreshMenu}
      />

      <DeleteDevice
        id={deviceId}
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        question={'Deseja realmente deletar este dispositivo?'}
        description={
          'Os dispositivos ou teclas vinculados serão deletados, deseja continuar? Esta ação não poderá ser desfeita!'
        }
      />

      <TreeItem nodeId='1' label='Dispositivos'>
        <TreeItem
          nodeId='2'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography component={'span'} variant={'h6'}>
                Central
              </Typography>
              <AddCircleIcon
                onClick={e => {
                  e.stopPropagation()
                  setShowAddCentralDialog(true)
                }}
                sx={{
                  fontSize: 16
                }}
              />
            </Box>
          }
        >
          {devices.map((central: any, index: number) => (
            <TreeItem
              key={central.projectDeviceId}
              nodeId={central.projectDeviceId}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {centralsStatus.length > 0 ? (
                      <IconifyIcon
                        icon='tabler:circle-filled'
                        width='0.7em'
                        color={
                          centralStatusObj?.[centralsStatus?.[index]?.[central?.boardId]] || centralStatusObj['false']
                        }
                      />
                    ) : (
                      <IconifyIcon icon='tabler:circle-filled' width='0.7em' color={centralStatusObj['false']} />
                    )}
                    <Typography component={'span'} variant={'h6'}>
                      {central.projectDeviceName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditNoteIcon
                      sx={{ fontSize: 18 }}
                      onClick={e => {
                        e.stopPropagation()
                        setDeviceId(central.projectDeviceId)
                        setShowEditCentralDialog(true)
                      }}
                    />
                    <CloseIcon
                      sx={{ fontSize: 16 }}
                      onClick={e => {
                        e.stopPropagation()
                        setDeviceId(central.projectDeviceId)
                        setShowDeleteDialog(true)
                      }}
                    />
                  </Box>
                </Box>
              }
            >
              <TreeItem
                key={`entradas${index}`}
                nodeId={`entradas${index}`}
                icon={<IconifyIcon icon='material-symbols:input-rounded' width='1.2em' height='1.2em' />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                    <Typography component={'span'} variant={'h6'}>
                      Entradas
                    </Typography>
                    <Typography
                      component={'span'}
                      variant={'h6'}
                      color={central.boardInputTotal < central.boardInputLimit ? 'green' : 'red'}
                    >
                      [{central.boardInputTotal}/{central.boardInputLimit}]
                    </Typography>
                  </Box>
                }
              >
                {central.inputPorts.map((inputPort: any, index: number) => (
                  <TreeItem
                    key={central.projectDeviceId + inputPort.order + index}
                    nodeId={central.projectDeviceId + inputPort.order + index}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                        <Typography component={'span'} variant={'h6'}>
                          {checkPortName(inputPort.order)}
                        </Typography>
                        <Typography
                          component={'span'}
                          variant={'h6'}
                          color={inputPort.portTotal < inputPort.portLimit ? 'green' : 'red'}
                        >
                          [{inputPort.portTotal}/{inputPort.portLimit}]
                        </Typography>
                      </Box>
                    }
                  >
                    {inputPort.inputs.map((input: any) => (
                      <TreeItem
                        key={'input' + input.projectDeviceId + input.deviceName}
                        nodeId={'input' + input.projectDeviceId + input.deviceName}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                              <Typography
                                component={'span'}
                                variant={'h6'}
                                onClick={() => {
                                  setProjectDeviceId(input.projectDeviceId)
                                  setKeyId(null)
                                }}
                              >
                                {verifyDeviceType(input.deviceType)} - {input.deviceName}
                              </Typography>
                              <Typography
                                component={'span'}
                                variant={'h6'}
                                color={input.deviceKeysTotal < input.deviceKeysLimit ? 'green' : 'red'}
                              >
                                [{input.deviceKeysTotal}/{input.deviceKeysLimit}]
                              </Typography>
                            </Box>
                            <CloseIcon
                              onClick={e => {
                                e.stopPropagation()
                                setDeviceId(input.projectDeviceId)
                                setShowDeleteDialog(true)
                              }}
                              sx={{ fontSize: 16 }}
                            />
                          </Box>
                        }
                      ></TreeItem>
                    ))}
                  </TreeItem>
                ))}
              </TreeItem>
              <TreeItem
                key={`saidas${index}`}
                nodeId={`saidas${index}`}
                icon={<IconifyIcon icon='material-symbols:output-rounded' width='1.2rem' height='1.2rem' />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                    <Typography component={'span'} variant={'h6'}>
                      Saídas
                    </Typography>
                    <Typography
                      component={'span'}
                      variant={'h6'}
                      color={central.boardOutputTotal < central.boardOutputLimit ? 'green' : 'red'}
                    >
                      [{central.boardOutputTotal}/{central.boardOutputLimit}]
                    </Typography>
                  </Box>
                }
              >
                {central.outputPorts.map((outputPort: any, index: number) => (
                  <TreeItem
                    key={'output' + central.projectDeviceId + outputPort.order + index}
                    nodeId={'output' + central.projectDeviceId + outputPort.order + index}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                        <Typography component={'span'} variant={'h6'}>
                          {checkPortName(outputPort.order)}
                        </Typography>
                        <Typography
                          component={'span'}
                          variant={'h6'}
                          color={outputPort.portTotal < outputPort.portLimit ? 'green' : 'red'}
                        >
                          [{outputPort.portTotal}/{outputPort.portLimit}]
                        </Typography>
                      </Box>
                    }
                  >
                    {outputPort.inputs.map((output: any) => (
                      <TreeItem
                        key={'output' + output.projectDeviceId + output.deviceName}
                        nodeId={'output' + output.projectDeviceId + output.deviceName}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                              <Typography
                                component={'span'}
                                variant={'h6'}
                                onClick={() => {
                                  setProjectDeviceId(output.projectDeviceId)
                                  setProjectDeviceIdOnDeviceKeys(null)
                                  setKeyId(null)
                                }}
                              >
                                {verifyDeviceType(output.deviceType)} - {output.deviceName}
                              </Typography>
                              <Typography
                                component={'span'}
                                variant={'h6'}
                                color={output.deviceKeysTotal < output.deviceKeysLimit ? 'green' : 'red'}
                              >
                                [{output.deviceKeysTotal}/{output.deviceKeysLimit}]
                              </Typography>
                            </Box>
                            <CloseIcon
                              onClick={e => {
                                e.stopPropagation()
                                setDeviceId(output.projectDeviceId)
                                setShowDeleteDialog(true)
                              }}
                              sx={{ fontSize: 16 }}
                            />
                          </Box>
                        }
                      ></TreeItem>
                    ))}
                  </TreeItem>
                ))}
              </TreeItem>
            </TreeItem>
          ))}
        </TreeItem>
      </TreeItem>
    </>
  )
}

export default Devices
