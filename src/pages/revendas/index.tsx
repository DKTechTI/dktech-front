import ResaleUsersList from 'src/views/pages/revendas/list'

const Resales = () => {
  return <ResaleUsersList />
}

Resales.acl = {
  action: 'manage',
  subject: 'admin'
}

export default Resales
