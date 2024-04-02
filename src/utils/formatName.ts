export const formatName = (name: string) => {
  const nameArray = name.split(' ')

  return nameArray.length > 3 ? `${nameArray[0]} ${nameArray[1]} ${nameArray[2]}...` : name
}
