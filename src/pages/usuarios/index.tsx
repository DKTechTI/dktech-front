import UsersList from 'src/views/pages/usuarios/list'

const Users = () => {
  return <UsersList />
}

Users.acl = {
  action: 'manage',
  subject: 'admin'
}

export default Users
