export const cleanedDocumentNumber = (document: string) => {
  return document.replace(/[^\d]/g, '')
}

export const formatDocumentNumber = (document: string, documentType: string) => {
  switch (documentType) {
    case 'CPF':
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    case 'CNPJ':
      return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    default:
      return document
  }
}
