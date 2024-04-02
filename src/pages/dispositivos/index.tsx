import DevicesList from 'src/views/pages/dispositivos/list'

const Devices = () => {
  return <DevicesList />
}

Devices.acl = {
  action: 'manage',
  subject: 'admin'
}

export default Devices
