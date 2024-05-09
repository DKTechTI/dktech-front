import { useState } from 'react'

import { Typography, Box } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view/TreeItem'

import { useProjectMenu } from 'src/hooks/useProjectMenu'
import { useProject } from 'src/hooks/useProject'

import { checkPortName } from 'src/utils/project'
import { verifyDeviceType } from 'src/utils/verifyDevice'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import CloseIcon from '@mui/icons-material/Close'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import AddCentral from './AddCentral'
import EditCentral from './EditCentral'
import DeleteDevice from './Delete'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

interface DevicesProps {
  devices: any
}

const Devices = ({ devices }: DevicesProps) => {
  const { setProjectDeviceId } = useProject()
  const { setKeyId, setProjectDeviceId: setProjectDeviceIdOnDeviceKeys } = useDeviceKeys()

  const { refreshMenu, setRefreshMenu } = useProjectMenu()

  const [showAddCentralDialog, setShowAddCentralDialog] = useState<boolean>(false)
  const [showEditCentralDialog, setShowEditCentralDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const [deviceId, setDeviceId] = useState<string>('')

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
          {devices.map((central: any, index: number) => {
            return (
              <TreeItem
                key={central.projectDeviceId}
                nodeId={central.projectDeviceId}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {central.connectionStatus ? (
                        <CheckCircleOutlineIcon
                          color={'success'}
                          sx={{
                            fontSize: 16
                          }}
                        />
                      ) : (
                        <HighlightOffIcon
                          color={'error'}
                          sx={{
                            fontSize: 16
                          }}
                        />
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
                  icon={
                    <ExitToAppIcon
                      sx={{
                        transform: 'rotate(180deg)'
                      }}
                    />
                  }
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
                  {central.inputPorts.map((inputPort: any, index: number) => {
                    return (
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
                        {inputPort.inputs.map((input: any) => {
                          return (
                            <TreeItem
                              key={'input' + input.projectDeviceId + input.deviceName}
                              nodeId={'input' + input.projectDeviceId + input.deviceName}
                              label={
                                <Box
                                  sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 2 }}
                                >
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
                          )
                        })}
                      </TreeItem>
                    )
                  })}
                </TreeItem>
                <TreeItem
                  key={`saidas${index}`}
                  nodeId={`saidas${index}`}
                  icon={<ExitToAppIcon />}
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
                  {central.outputPorts.map((outputPort: any, index: number) => {
                    return (
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
                        {outputPort.inputs.map((output: any) => {
                          return (
                            <TreeItem
                              key={'output' + output.projectDeviceId + output.deviceName}
                              nodeId={'output' + output.projectDeviceId + output.deviceName}
                              label={
                                <Box
                                  sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 2 }}
                                >
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
                          )
                        })}
                      </TreeItem>
                    )
                  })}
                </TreeItem>
              </TreeItem>
            )
          })}
        </TreeItem>
      </TreeItem>
    </>
  )
}

export default Devices
