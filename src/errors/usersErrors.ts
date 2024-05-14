const usersErrors = {
  401: {
    '-> usuario não tem permissão para alterar este usuário': 'Você não tem permissão para alterar este usuário.',
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Você não tem permissão para acessar essa rota': 'Você não tem permissão para acessar essa rota',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'User type is not valid': 'Tipo de usuário inválido.',
    'User type not defined': 'Tipo de usuário não definido.',
    'User status is not valid': 'Status de usuário inválido.',
    'User Not Found': 'Usuário não encontrado.'
  },
  409: {
    'User Already Exists': 'Usuário já cadastrado.',
    'User cannot have their type changed': 'Usuário não pode ter seu tipo alterado.'
  }
}

export default usersErrors
