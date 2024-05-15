const clientsErrors = {
  400: {
    'body/number must be number': 'Número do endereço deve conter apenas números'
  },
  401: {
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Você não tem permissão para acessar essa rota': 'Você não tem permissão para acessar essa rota',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'Client Not Found': 'Cliente não encontrado.',
    'User Not Found': 'Cliente não encontrado.'
  }
}

export default clientsErrors
