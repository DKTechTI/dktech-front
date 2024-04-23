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

export { checkActionValueEngine }
