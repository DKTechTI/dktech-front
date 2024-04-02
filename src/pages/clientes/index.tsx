import ClientsList from 'src/views/pages/clientes/list'

const Clients = () => {
  return <ClientsList />
}

Clients.acl = {
  action: 'read',
  subject: 'client'
}

export default Clients
