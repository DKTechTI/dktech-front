import { SocketIOProvider } from 'src/context/SocketIOContext'
import MonitorateContent from 'src/views/pages/monitoramento'

const Monitorate = () => {
  return (
    <SocketIOProvider>
      <MonitorateContent />
    </SocketIOProvider>
  )
}

Monitorate.acl = {
  action: 'read',
  subject: 'client'
}

export default Monitorate
