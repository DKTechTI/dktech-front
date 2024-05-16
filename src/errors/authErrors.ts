const authErrors = {
  401: {
    '-> usuario não tem permissão para alterar este usuário': 'Você não tem permissão para alterar este usuário.',
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.'
  },
  404: {
    'User Not Found': 'E-mail não encontrado, verifique se o e-mail está correto',
    'Email or Password Invalid': 'E-mail ou senha inválidos.'
  },
  409: {
    'Email or Password Invalid': 'E-mail ou senha inválidos.',
    'Refresh token Invalid': 'Sua sessão expirou, faça login novamente.',
    'Invalid old password!': 'Senha antiga inválida.',
    'New password can not match the old password!': 'A nova senha não pode ser igual a senha antiga.',
    "Passwords doesn't match!": 'As senhas não conferem.'
  },
  500: {
    'Error: ConfigError: Missing region in config': 'Ocorreu um erro, tente novamente.',
    'Error on change user password': 'Ocorreu um erro, tente novamente.'
  }
}

export default authErrors
