const checkPortName = (order: number) => {
  if (order < 0 || order > 51) return order

  const char = String.fromCharCode(order < 26 ? 65 + order : 97 + order - 26)

  return `Porta ${char}`
}

export { checkPortName }
