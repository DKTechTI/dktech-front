export const verifyUserStatus = (status: string) => {
  switch (status) {
    case 'active':
      return 'Ativo'
    case 'inactive':
      return 'Inativo'
    case 'blocked':
      return 'Bloqueado'
    case 'pending':
      return 'Pendente'
  }
}

export const verifyUserType = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrador'
    case 'client':
      return 'Cliente'
  }
}
