const devicesErrors = {
  401: {
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Você não tem permissão para acessar essa rota': 'Você não tem permissão para acessar essa rota',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'Device Not Found': 'Dispositivo não encontrado.'
  },
  409: {
    'Device type KEYPAD needs fields keysQuantity to be defined and greater than 0':
      'O tipo de dispositivo KEYPAD precisa que a quantidade de teclas seja definida e maior que 0.',
    'Device type CENTRAL needs fields inputPortsTotal to be defined and greater than 0':
      'O tipo de dispositivo CENTRAL precisa que a quantidade de portas de entrada seja definida e maior que 0.',
    'Device type CENTRAL needs fields inputTotal to be defined and greater than 0':
      'O tipo de dispositivo CENTRAL precisa que a quantidade de entradas seja definida e maior que 0.',
    'Device type CENTRAL needs fields outputPortsTotal to be defined and greater than 0':
      'O tipo de dispositivo CENTRAL precisa que a quantidade de portas de saída seja definida e maior que 0.',
    'Device type CENTRAL needs fields outputTotal to be defined and greater than 0':
      'O tipo de dispositivo CENTRAL precisa que a quantidade de saídas seja definida e maior que 0.',
    'Device type CENTRAL can not be moduleType INPUT': 'O tipo de dispositivo CENTRAL não pode ter o moduleType INPUT.',
    'Device type CENTRAL can not be moduleType OUTPUT':
      'O tipo de dispositivo CENTRAL não pode ter o moduleType OUTPUT.',
    'Device type CENTRAL can not be operationType RELES':
      'O tipo de dispositivo CENTRAL não pode ter o tipo de operação RELES.',
    'Device type CENTRAL can not be operationType DIMMER':
      'O tipo de dispositivo CENTRAL não pode ter o tipo de operação DIMMER.',
    'Device type CENTRAL can not be operationType ENGINE':
      'O tipo de dispositivo CENTRAL não pode ter o tipo de operação ENGINE.'
  }
}

export default devicesErrors
