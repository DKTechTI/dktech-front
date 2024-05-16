const projectScenesErrors = {
  401: {
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'Project Not Found': 'Projeto não encontrado.',
    'Device Not Found': 'Dispositivo não encontrado.',
    'Project Device Key Not Found': 'Tecla do dispositivo não encontrada.',
    'Project Scene Not Found': 'Cena não encontrada.'
  },
  409: {
    'Project Scene type PULSE needs fields pulseQuantity to be defined and greater than 0':
      'O tipo de cena PULSE precisa que o campo pulseQuantity seja definido e maior que 0.',
    'Project Scene type PULSE needs fields ledAction to be defined and greater than 0':
      'O tipo de cena PULSE precisa que o campo ledAction seja definido e maior que 0.',
    'Project Scene type PULSE cannot have timePressed defined':
      'O tipo de cena PULSE não pode ter timePressed definido.',
    'Project Scene type PULSE cannot have pulseQuantity minor than 5':
      'O tipo de cena PULSE não pode ter pulseQuantity menor que 5.',
    'Project Scene eventType REPEAT needs fields isRepeatEvent to be defined and not false':
      'O tipo de cena REPEAT precisa que o campo isRepeatEvent seja definido e não falso.',
    'Project Scene eventType REPEAT needs fields ledAction to be defined and not false':
      'O tipo de cena REPEAT precisa que o campo ledAction seja definido e não falso.',
    'Project Scene type REPEAT cannot have timePressed defined':
      'O tipo de cena REPEAT não pode ter timePressed definido.',
    'Project Scene type REPEAT cannot have pulseQuantity defined':
      'O tipo de cena REPEAT não pode ter pulseQuantity definido.',
    'Scene eventType TIME_PRESSED needs fields timePressed to be defined and greater than 0':
      'O tipo de cena TIME_PRESSED precisa que o campo timePressed seja definido e maior que 0.',
    'Scene eventType TIME_PRESSED needs fields ledAction to be defined and greater than 0':
      'O tipo de cena TIME_PRESSED precisa que o campo ledAction seja definido e maior que 0.',
    'Project Scene type TIME_PRESSED cannot have pulseQuantity defined':
      'O tipo de cena TIME_PRESSED não pode ter pulseQuantity definido.'
  }
}

export default projectScenesErrors
