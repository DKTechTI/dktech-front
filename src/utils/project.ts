const checkPortName = (order: number) => {
  if (order < 0 || order > 51) return order

  const char = String.fromCharCode(order < 26 ? 65 + order : 97 + order - 26)

  return `Porta ${char}`
}

const checkSequenceIndex = (index: number) => {
  return Number(index) + 1
}

const checkInitialValue = (operationType: string) => {
  switch (operationType) {
    case 'DIMMER':
      return [
        {
          name: '0',
          value: '0'
        },
        {
          name: '10',
          value: '10'
        },
        {
          name: '20',
          value: '20'
        },
        {
          name: '30',
          value: '30'
        },
        {
          name: '40',
          value: '40'
        },
        {
          name: '50',
          value: '50'
        },
        {
          name: '60',
          value: '60'
        },
        {
          name: '70',
          value: '70'
        },
        {
          name: '80',
          value: '80'
        },
        {
          name: '90',
          value: '90'
        },
        {
          name: '100',
          value: '100'
        },
        {
          name: 'Aumentar',
          value: 'INCREASE'
        },
        {
          name: 'Diminuir',
          value: 'DECREASE'
        },
        {
          name: 'Dimerizar',
          value: 'DIM'
        }
      ]
    case 'RELES':
      return [
        {
          name: 'Ligar',
          value: 'TRUE'
        },
        {
          name: 'Desligar',
          value: 'FALSE'
        }
      ]
    case 'ENGINE':
      return [
        {
          name: 'Abrir',
          value: 'OPEN'
        },
        {
          name: 'Fechar',
          value: 'CLOSE'
        },
        {
          name: 'Parar',
          value: 'STOP'
        },
        {
          name: 'Abrir/Parar',
          value: 'OPEN/STOP'
        },
        {
          name: 'Fechar/Parar',
          value: 'CLOSE/STOP'
        },
        {
          name: 'Abrir/Parar/Fechar/Parar',
          value: 'OPEN/STOP/CLOSE/STOP'
        }
      ]
    default:
      return []
  }
}

export { checkPortName, checkSequenceIndex, checkInitialValue }
