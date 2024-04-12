import { useContext } from 'react'
import { DeviceKeysContext } from 'src/context/DeviceKeysContext'

export const useDeviceKeys = () => useContext(DeviceKeysContext)
