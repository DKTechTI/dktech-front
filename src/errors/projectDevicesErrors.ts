const projectDevicesErrors = {
  401: {
    'Authorization is missing!': 'Ocorreu um erro, tente novamente.',
    'Authorization token is missing!': 'Ocorreu um erro, tente novamente.',
    'Error on Authenticate': 'Ocorreu um erro, tente novamente.',
    'Invalid token': 'Token inválido, tente novamente.',
    'Error on auth token validation proccess': 'Ocorreu um erro, tente novamente.'
  },
  404: {
    'Device Not Found': 'Dispositivo não encontrado.',
    'Project Not Found': 'Projeto não encontrado.',
    'Project Environment Not Found': 'Ambiente do projeto não encontrado.',
    'Project Device Central Not Found': 'Central do dispositivo não encontrada.',
    'Project Central Not Found': 'Central do projeto não encontrada.'
  },
  409: {
    'This central port is not available': 'Esta porta da central não está disponível.',
    'Project Device moduleType INOUT is only accepted in CENTRAL devices':
      'O tipo de módulo INOUT é aceito apenas em dispositivos CENTRAL.',
    'Project Device type CENTRAL only accept moduleType INOUT':
      'Dispositivos CENTRAL aceitam apenas o tipo de módulo INOUT.',
    'Project Device type CENTRAL needs fields [port] to be defined':
      'Dispositivos CENTRAL precisam que os campos [port] sejam definidos.',
    'Project Device type CENTRAL needs fields [dns] to be defined':
      'Dispositivos CENTRAL precisam que os campos [dns] sejam definidos.',
    'Project Device type CENTRAL needs fields [subnet] to be defined':
      'Dispositivos CENTRAL precisam que os campos [subnet] sejam definidos.',
    'Project Device type CENTRAL needs fields [gateway] to be defined':
      'Dispositivos CENTRAL precisam que os campos [gateway] sejam definidos.',
    'Project Device type CENTRAL needs fields [ip] to be defined':
      'Dispositivos CENTRAL precisam que os campos [ip] sejam definidos.',
    'Project Device type CENTRAL needs fields [tcp] to be defined':
      'Dispositivos CENTRAL precisam que os campos [tcp] sejam definidos.',
    'Project Device type CENTRAL needs fields [dhcp] to be defined':
      'Dispositivos CENTRAL precisam que os campos [dhcp] sejam definidos.',
    'Project centralId can not be changed on devices type CENTRAL':
      'O centralId do projeto não pode ser alterado em dispositivos do tipo CENTRAL.'
  }
}

export default projectDevicesErrors
