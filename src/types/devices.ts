export interface DeviceProps {
  _id: string
  type: 'CENTRAL' | 'MODULE' | 'KEYPAD'
  moduleType: 'INPUT' | 'OUTPUT' | 'INOUT'
  keysQuantity: number
  operationType: 'DIMMER' | 'RELES' | 'ENGINE' | 'NONE'
  status: 'ACTIVE' | 'INACTIVE'
  modelName: string
  inputPortsTotal: number
  inputTotal: number
  outputPortsTotal: number
  outputTotal: number
  createdAt: string
  updatedAt: string
}

export interface DeviceDataProps {
  page: number
  per_page: number
  pre_page: number | null
  next_page: number
  total: number
  total_pages: number
  data: DeviceProps[]
}
