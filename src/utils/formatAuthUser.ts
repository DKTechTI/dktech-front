export const formatAuthUser = (user: any) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: String(user.type).toLocaleLowerCase(),
    avatar: user.avatar || null
  }
}
