const checkActionValueEngine = (action: string) => {
  const values: { [key: string]: string } = {
    OPEN: 'Abrir',
    CLOSE: 'Fechar',
    STOP: 'Parar',
    'OPEN/STOP': 'Abrir/Parar',
    'CLOSE/STOP': 'Fechar/Parar',
    'OPEN/STOP/CLOSE/STOP': 'Abrir/Parar/Fechar/Parar'
  }

  return values[action] || ''
}

const handleCheckOperationType = (value: string) => {
  const rele = ['TRUE', 'FALSE']
  const engine = ['OPEN', 'CLOSE', 'STOP', 'OPEN/STOP', 'CLOSE/STOP', 'OPEN/STOP/CLOSE/STOP']
  const dimmer = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', 'INCREASE', 'DECREASE', 'DIM']

  if (rele.includes(value)) return 'RELE'
  if (engine.includes(value)) return 'ENGINE'
  if (dimmer.includes(value)) return 'DIMMER'
}

export { checkActionValueEngine, handleCheckOperationType }
