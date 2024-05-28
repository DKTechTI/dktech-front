export type MenuProps = {
  projectName: string
  devices: DeviceProps[]
  environments: EnvironmentProps[]
}

export type DeviceProps = {
  projectDeviceId: string
  boardId: string
  projectDeviceName: string
  configurated: boolean
  connectionStatus: boolean
  boardOutputLimit: number
  boardOutputTotal: number
  boardInputLimit: number
  boardInputTotal: number
  inputPorts: PortProps[]
  outputPorts: PortProps[]
}

export type PortProps = {
  order: number
  portLimit: number
  portTotal: number
  inputs: InputProps[]
}

export type InputProps = {
  order: number
  projectDeviceId: string
  deviceType: string
  deviceName: string
  deviceKeysLimit: number
  deviceKeysTotal: number
}

export type EnvironmentProps = {
  environmentId: string
  name: string
  inputs: EnvironmentDeviceProps[]
  outputs: EnvironmentDeviceProps[]
}

export type EnvironmentDeviceProps = {
  projectDeviceId: string
  projectDeviceKeyId: string
  deviceName: string
  deviceKeyName: string
  boardId: string
  keyDeviceOrder: number
}
