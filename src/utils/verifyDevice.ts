const verifyDeviceType = (deviceType: string) => {
  switch (deviceType) {
    case 'CENTRAL':
      return 'Central'
    case 'MODULE':
      return 'Módulo'
    case 'KEYPAD':
      return 'keypad'
    default:
      return 'Tipo não encontrado'
  }
}

const verifyModuleType = (moduleType: string) => {
  switch (moduleType) {
    case 'INPUT':
      return 'Entrada'
    case 'OUTPUT':
      return 'Saída'
    case 'INOUT':
      return 'Entrada/Saída'
    default:
      return 'Tipo não encontrado'
  }
}

const verifyDeviceStatus = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Ativo'
    case 'INACTIVE':
      return 'Inativo'
    default:
      return 'Status não encontrado'
  }
}

export { verifyDeviceType, verifyModuleType, verifyDeviceStatus }
