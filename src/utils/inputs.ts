const applyCnpjMask = (value: string) => {
  value = value.replace(/\D/g, '') // Remove qualquer caractere que não seja número

  if (value.length > 12) {
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  } else if (value.length > 8) {
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4')
  } else if (value.length > 5) {
    value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3')
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{3})/, '$1.$2')
  }

  return value
}

const applyCpfMask = (value: string) => {
  value = value.replace(/\D/g, '')

  if (value.length > 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (value.length > 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3')
  } else if (value.length > 3) {
    value = value.replace(/(\d{3})(\d{3})/, '$1.$2')
  }

  return value
}

const applyMask = (value: string, type: string) => {
  switch (type) {
    case 'CPF':
      return applyCpfMask(value.slice(0, 14))
    case 'CNPJ':
      return applyCnpjMask(value.slice(0, 18))
    default:
      return value
  }
}

export { applyMask, applyCpfMask, applyCnpjMask }
