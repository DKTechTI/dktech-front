import toast from 'react-hot-toast'

const verifyChangePasswordErrors = (error: number, message: string) => {
  switch (error) {
    case 401:
      return toast.error('Erro ao redefinir senha, token inválido')
    case 404:
      return toast.error('Erro ao redefinir senha, usuário não encontrado')
    case 409:
      if (message === 'New password can not match the old password!')
        return toast.error('Erro ao redefinir senha, nova senha não pode ser igual a antiga')

      return toast.error('Erro ao redefinir senha, senha incorreta')
    default:
      return toast.error('Erro ao redefinir senha, tente novamente mais tarde')
  }
}

const verifyChangePasswordAdminErrors = (error: number, message: string) => {
  switch (error) {
    case 401:
      return toast.error('Erro ao redefinir senha, token inválido')
    case 404:
      return toast.error('Erro ao redefinir senha, usuário não encontrado')
    case 409:
      if (message === 'New password can not match the old password!')
        return toast.error('Erro ao redefinir senha, nova senha não pode ser igual a antiga')

      return toast.error('Erro ao redefinir senha, tente novamente mais tarde')
    default:
      return toast.error('Erro ao redefinir senha, tente novamente mais tarde')
  }
}

export { verifyChangePasswordErrors, verifyChangePasswordAdminErrors }
