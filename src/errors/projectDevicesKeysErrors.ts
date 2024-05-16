const projectDevicesKeysErrors = {
  401: {
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'Project Not Found': 'Projeto não encontrado.',
    'Project Device Not Found': 'Dispositivo não encontrado.',
    'Project Environment Not Found': 'Ambiente não encontrado.',
    'Project Device Key Not Found': 'Tecla do dispositivo não encontrada.'
  },
  409: {
    'Project Device Type Central cannot have any keys': 'Dispositivo do tipo Central não pode ter teclas.'
  }
}

export default projectDevicesKeysErrors
