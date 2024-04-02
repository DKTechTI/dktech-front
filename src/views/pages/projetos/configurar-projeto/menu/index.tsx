import * as React from 'react'
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { Typography } from '@mui/material'
import { checkPortName } from 'src/utils/project'

const menu = {
  projectName: 'Project Test',
  devices: [
    {
      projectDeviceId: '_E0zsyCZAmk4t8FnlL0z4',
      projectDeviceName: 'CENTRAL Teste',
      configurated: false,
      connectionStatus: true,
      boardOutputLimit: 10,
      boardOutputTotal: 2,
      boardInputLimit: 8,
      boardInputTotal: 2,
      inputPorts: [
        {
          order: 0,
          portLimit: 1,
          portTotal: 1,
          inputs: [
            {
              order: 0,
              projectDeviceId: 'OszTnTGnZvkL06FyQxobU',
              deviceType: 'KEYPAD',
              deviceName: 'KEYPAD 4 TECLAS',
              deviceKeysLimit: 8,
              deviceKeysTotal: 1
            }
          ]
        }
      ],
      outputPorts: [
        {
          order: 0,
          portLimit: 1,
          portTotal: 1,
          inputs: [
            {
              order: 0,
              projectDeviceId: 'P4f7H_km12ABkWhZnHn0o',
              deviceType: 'MODULE',
              deviceName: 'RELES 4',
              deviceKeysLimit: 4,
              deviceKeysTotal: 0
            }
          ]
        }
      ]
    }
  ],
  environments: [
    {
      environmentId: 'pmY0jcc_VqQFw3BbmbIoi',
      name: 'Sala',
      inputs: [
        {
          projectDeviceId: 'OszTnTGnZvkL06FyQxobU',
          projectDeviceKeyId: 'tfGtvU9gM0EGDS5H3l1sk',
          deviceName: 'KEYPAD 4 TECLAS',
          deviceKeyName: 'Tecla 1',
          deviceKeysLimit: 8,
          deviceKeysTotal: 1
        }
      ],
      outputs: []
    },
    {
      environmentId: 'Z52qSf7UyFLrko9vRmk8M',
      name: 'Cozinha',
      inputs: [],
      outputs: []
    }
  ]
}

const handleRenderDevices = (devices: any) => {
  return (
    <TreeItem nodeId='1' label='Dispositivos'>
      <TreeItem
        key={'id'}
        nodeId='id'
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography component={'span'} variant={'h6'}>
              Central
            </Typography>
            <AddCircleIcon
              onClick={e => {
                e.stopPropagation()
                alert('adicionar Central')
              }}
              sx={{
                fontSize: 15
              }}
            />
          </Box>
        }
      >
        {devices.map((central: any) => {
          return (
            <TreeItem
              key={central.projectDeviceId}
              nodeId={central.projectDeviceId}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography component={'span'} variant={'h6'}>
                    {central.projectDeviceName}
                  </Typography>
                  {central.connectionStatus ? (
                    <CheckCircleOutlineIcon
                      color={'success'}
                      sx={{
                        fontSize: 15
                      }}
                    />
                  ) : (
                    <HighlightOffIcon
                      color={'error'}
                      sx={{
                        fontSize: 15
                      }}
                    />
                  )}
                </Box>
              }
            >
              <TreeItem
                key='entradas'
                nodeId='entradas'
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography component={'span'} variant={'h6'}>
                                  {input.deviceType} {input.deviceName}
                                </Typography>
                                <Typography
                                  component={'span'}
                                  variant={'h6'}
                                  color={input.deviceKeysTotal < input.deviceKeysLimit ? 'green' : 'red'}
                                >
                                  [{input.deviceKeysTotal}/{input.deviceKeysLimit}]
                                </Typography>
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
                key='saidas'
                nodeId='saidas'
                icon={<ExitToAppIcon />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography component={'span'} variant={'h6'}>
                                  {output.deviceType} {output.deviceName}
                                </Typography>
                                <Typography
                                  component={'span'}
                                  variant={'h6'}
                                  color={output.deviceKeysTotal < output.deviceKeysLimit ? 'green' : 'red'}
                                >
                                  [{output.deviceKeysTotal}/{output.deviceKeysLimit}]
                                </Typography>
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
  )
}

const handleRenderEnvironments = (environments: any) => {
  return (
    <TreeItem
      key={'2'}
      nodeId='2'
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography component={'span'} variant={'h6'}>
            Ambientes
          </Typography>
          <AddCircleIcon
            onClick={e => {
              e.stopPropagation()
              alert('adicionar Ambiente')
            }}
            sx={{
              fontSize: 15
            }}
          />
        </Box>
      }
    >
      {environments.map((environment: any) => {
        return (
          <TreeItem key={environment.environmentId} nodeId={environment.environmentId} label={environment.name}>
            <TreeItem
              key={environment.environmentId + 'entradas'}
              nodeId={environment.environmentId + 'entradas'}
              label={'Entradas'}
            >
              {environment.inputs.map((input: any, index: number) => {
                return (
                  <TreeItem
                    key={input.projectDeviceId + input.projectDeviceKeyId}
                    nodeId={input.projectDeviceId + input.projectDeviceKeyId}
                    label={
                      <Typography component={'span'} variant={'h6'}>
                        [{index + 1}] {input.deviceKeyName} {input.deviceName}
                      </Typography>
                    }
                  ></TreeItem>
                )
              })}
            </TreeItem>
            <TreeItem
              key={environment.environmentId + 'saidas'}
              nodeId={environment.environmentId + 'saidas'}
              label={'Saídas'}
            >
              {environment.outputs.map((output: any, index: number) => {
                return (
                  <TreeItem
                    key={output.projectDeviceId + output.projectDeviceKeyId}
                    nodeId={output.projectDeviceId + output.projectDeviceKeyId}
                    label={
                      <Typography component={'span'} variant={'h6'}>
                        [{index + 1}] {output.deviceKeyName} {output.deviceName}
                      </Typography>
                    }
                  ></TreeItem>
                )
              })}
            </TreeItem>
          </TreeItem>
        )
      })}
    </TreeItem>
  )
}

export default function Menu() {
  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <TreeView
        aria-label='rich object'
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['']}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}
      >
        {handleRenderDevices(menu.devices)}
        {handleRenderEnvironments(menu.environments)}
      </TreeView>
    </Box>
  )
}
