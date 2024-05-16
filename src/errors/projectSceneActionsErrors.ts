const projectSceneActionsErrors = {
  401: {
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'Project Not Found': 'Projeto não encontrado.',
    'Project Scene Not Found': 'Cena do projeto não encontrada.',
    'Project Device Action Not Found': 'Dispositivo não encontrada.',
    'Project Device Key Action Not Found': 'Tecla do dispositivo não encontrada.',
    'Project Device Key Not Found': 'Tecla do dispositivo não encontrada.',
    'Action Project Device Key Not Found': 'Tecla do dispositivo não encontrada.',
    'Action Project Device Not Found': 'Dispositivo não encontrado.',
    'Project Scene Action Not Found': 'Ação da cena não encontrada.'
  },
  409: {
    'Project Scene Action type DELAY needs fields actionValueDelay to be defined and greater than 0':
      'O tipo de ação DELAY precisa que o campo actionValueDelay seja definido e maior que 0.',
    'Project Scene Action type DELAY needs fields projectDeviceKeyId to be defined and greater than 0':
      'O tipo de ação DELAY precisa que o campo projectDeviceKeyId seja definido e maior que 0.',
    'Action on a device operationType DELAY cannot have actionValueReles defined':
      'Ação em um dispositivo do tipo DELAY não pode ter actionValueReles definido.',
    'Action on a device operationType DELAY cannot have actionValueEngine defined':
      'Ação em um dispositivo do tipo DELAY não pode ter actionValueEngine definido.',
    'Action on a device operationType DELAY cannot have actionValueDimmer defined':
      'Ação em um dispositivo do tipo DELAY não pode ter actionValueDimmer definido.',
    'Action on a device operationType DIMMER cannot have actionValueReles defined':
      'Ação em um dispositivo do tipo DIMMER não pode ter actionValueReles definido.',
    'Action on a device operationType DIMMER cannot have actionValueEngine defined':
      'Ação em um dispositivo do tipo DIMMER não pode ter actionValueEngine definido.',
    'Action on a device operationType DIMMER needs fields actionValueDimmer to be defined':
      'Ação em um dispositivo do tipo DIMMER precisa que o campo actionValueDimmer seja definido.',
    'Action on a device operationType DIMMER needs fields actionProjectDeviceKeyId to be defined':
      'Ação em um dispositivo do tipo DIMMER precisa que o campo actionProjectDeviceKeyId seja definido.',
    'Action on a device operationType DIMMER needs fields projectDeviceKeyId to be defined':
      'Ação em um dispositivo do tipo DIMMER precisa que o campo projectDeviceKeyId seja definido.',
    'Action on a device operationType DIMMER cannot have actionValueDelay defined':
      'Ação em um dispositivo do tipo DIMMER não pode ter actionValueDelay definido.',
    'Action on a device operationType RELES needs fields actionValueReles to be defined and not false':
      'Ação em um dispositivo do tipo RELES precisa que o campo actionValueReles seja definido e não falso.',
    'Action on a device operationType RELES needs fields actionProjectDeviceKeyId to be defined and not false':
      'Ação em um dispositivo do tipo RELES precisa que o campo actionProjectDeviceKeyId seja definido e não falso.',
    'Action on a device operationType RELES needs fields projectDeviceKeyId to be defined and not false':
      'Ação em um dispositivo do tipo RELES precisa que o campo projectDeviceKeyId seja definido e não falso.',
    'Action on a device operationType RELES cannot have actionValueDimmer defined':
      'Ação em um dispositivo do tipo RELES não pode ter actionValueDimmer definido.',
    'Action on a device operationType RELES cannot have actionValueEngine defined':
      'Ação em um dispositivo do tipo RELES não pode ter actionValueEngine definido.',
    'Action on a device operationType RELES cannot have actionValueDelay defined':
      'Ação em um dispositivo do tipo RELES não pode ter actionValueDelay definido.',
    'Action on a device operationType ENGINE needs fields actionValueEngine to be defined and not false':
      'Ação em um dispositivo do tipo ENGINE precisa que o campo actionValueEngine seja definido e não falso.',
    'Action on a device operationType ENGINE needs fields actionProjectDeviceKeyId to be defined and not false':
      'Ação em um dispositivo do tipo ENGINE precisa que o campo actionProjectDeviceKeyId seja definido e não falso.',
    'Action on a device operationType ENGINE needs fields projectDeviceKeyId to be defined and not false':
      'Ação em um dispositivo do tipo ENGINE precisa que o campo projectDeviceKeyId seja definido e não falso.',
    'Action on a device operationType ENGINE cannot have actionValueDimmer defined':
      'Ação em um dispositivo do tipo ENGINE não pode ter actionValueDimmer definido.',
    'Action on a device operationType ENGINE cannot have actionValueReles defined':
      'Ação em um dispositivo do tipo ENGINE não pode ter actionValueReles definido.',
    'Action on a device operationType ENGINE cannot have actionValueDelay defined':
      'Ação em um dispositivo do tipo ENGINE não pode ter actionValueDelay definido.'
  }
}

export default projectSceneActionsErrors
