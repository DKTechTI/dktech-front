const verifyProjectStatus = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'Publicado'
    case 'DRAFT':
      return 'Não publicado'
    default:
      return 'Status não encontrado'
  }
}

export { verifyProjectStatus }
