const projectEnvironmentsErrors = {
  401: {
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'Project Not Found': 'Projeto não encontrado.',
    'Project Environment Not Found': 'Ambiente não encontrado.'
  },
  409: {
    'This project environment name is already in use': 'Nome de ambiente já em uso.'
  }
}

export default projectEnvironmentsErrors
