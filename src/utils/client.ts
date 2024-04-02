export const verifyClientStatus = (status: string) => {
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
