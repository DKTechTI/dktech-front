import { createContext, useCallback, useMemo } from 'react'

import { useRouter } from 'next/router'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { DeviceProps, MenuProps } from 'src/types/menu'

interface SequenceProps {
  index: string
  avaliable: boolean
}

interface PortsProps {
  port: string
  avaliable: boolean
  keysLimit: number
  keysQuantity: number
  keysQuantityAvaliable: number
  sequence: SequenceProps[]
  sequenceUpdate: SequenceProps[]
}

type projectMenuValuesType = {
  menu: null | MenuProps
  loadingMenu: boolean
  refreshMenu: boolean
  setRefreshMenu: (value: boolean) => void
  handleAvaliableInputPorts: (centralId: string) => Promise<any[]>
  handleAvaliableOutputPorts: (centralId: string) => Promise<any[]>
  handleCheckDeviceSequence: (deviceId: string, centralId: string, where: 'inputPorts' | 'outputPorts') => number | null
  handleCheckDevicePort: (deviceId: string, centralId: string, where: 'inputPorts' | 'outputPorts') => number | null
}

const defaultProvider: projectMenuValuesType = {
  menu: null,
  loadingMenu: true,
  refreshMenu: false,
  setRefreshMenu: () => Boolean,
  handleAvaliableInputPorts: () => Promise.resolve([]),
  handleAvaliableOutputPorts: () => Promise.resolve([]),
  handleCheckDeviceSequence: () => null,
  handleCheckDevicePort: () => null
}

const ProjectMenuContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const ProjectMenuProvider = ({ children }: Props) => {
  const router = useRouter()

  const { id } = router.query

  const {
    data: menu,
    refresh: refreshMenu,
    setRefresh: setRefreshMenu,
    loading: loadingMenu
  } = useGetDataApi<MenuProps>({ url: `/projects/menu/${id}`, callInit: router.isReady })

  const handleAvaliableInputPorts = useCallback(async (centralId: string) => {
    if (!centralId) {
      return []
    }

    try {
      const ports: PortsProps[] = []

      const sequenceLimit = 4
      const response = await api.get(`/projectDevices/${centralId}`)
      const central = response.data.data

      const outputPorts = Object.keys(central.indexMenuDevices.inputs)

      outputPorts.map((inputPort: any) => {
        const keys = Object.keys(central.indexGlobalKeys.inputs[inputPort])
        const keysLimit = keys.length
        const keysQuantity = keys.length
        let keysQuantityAvaliable = keysQuantity

        for (let j = 0; j < keys.length; j++) {
          const key = keys[j]
          const keyData = central.indexGlobalKeys.inputs[inputPort][key]

          if (keyData.keyId !== null) {
            keysQuantityAvaliable--
          }
        }

        const arraySequenceAvaliable: SequenceProps[] = []
        const arraySequenceUpdate: SequenceProps[] = []

        for (let i = 0; i < sequenceLimit; i++) {
          const isAvailable = central.indexMenuDevices.inputs[inputPort][i] === null

          if (!isAvailable) {
            arraySequenceUpdate.push({
              index: String(i),
              avaliable: !isAvailable
            })
          }

          arraySequenceAvaliable.push({
            index: String(i),
            avaliable: isAvailable
          })

          if (isAvailable) {
            break
          }
        }

        ports.push({
          port: inputPort,
          avaliable: keysQuantityAvaliable > 0 ? true : false,
          keysLimit: keysLimit,
          keysQuantity: keysQuantity,
          keysQuantityAvaliable: keysQuantityAvaliable,
          sequence: arraySequenceAvaliable,
          sequenceUpdate: arraySequenceUpdate
        })
      })

      return ports
    } catch (error) {
      toast.error('Erro ao buscar dados do dispositivo central')

      return []
    }
  }, [])

  const handleAvaliableOutputPorts = useCallback(async (centralId: string) => {
    if (!centralId) {
      return []
    }

    try {
      const ports: PortsProps[] = []

      const sequenceLimit = 4
      const response = await api.get(`/projectDevices/${centralId}`)
      const central = response.data.data

      const outputPorts = Object.keys(central.indexMenuDevices.outputs)

      outputPorts.map((outputPort: any) => {
        const keys = Object.keys(central.indexGlobalKeys.outputs[outputPort])
        const keysLimit = keys.length
        const keysQuantity = keys.length
        let keysQuantityAvaliable = keysQuantity

        for (let j = 0; j < keys.length; j++) {
          const key = keys[j]
          const keyData = central.indexGlobalKeys.outputs[outputPort][key]

          if (keyData.keyId !== null) {
            keysQuantityAvaliable = 0

            break
          }
        }

        const arraySequenceAvaliable: SequenceProps[] = []
        const arraySequenceUpdate: SequenceProps[] = []

        for (let i = 0; i < sequenceLimit; i++) {
          const isAvailable = central.indexMenuDevices.outputs[outputPort][i] === null

          if (!isAvailable) {
            arraySequenceUpdate.push({
              index: String(i),
              avaliable: !isAvailable
            })
          }

          arraySequenceAvaliable.push({
            index: String(i),
            avaliable: isAvailable
          })

          if (isAvailable) {
            break
          }
        }

        ports.push({
          port: outputPort,
          avaliable: keysQuantityAvaliable > 0 ? true : false,
          keysLimit: keysLimit,
          keysQuantity: keysQuantity,
          keysQuantityAvaliable: keysQuantityAvaliable,
          sequence: arraySequenceAvaliable,
          sequenceUpdate: arraySequenceUpdate
        })
      })

      return ports
    } catch (error) {
      toast.error('Erro ao buscar dados do dispositivo central')

      return []
    }
  }, [])

  const handleCheckDeviceSequence = useMemo(
    () => (deviceId: string, centralId: string, where: 'inputPorts' | 'outputPorts') => {
      const central = menu?.devices.find((central: DeviceProps) => central.projectDeviceId === centralId)
      if (central) {
        const portQuantity = central[where].length

        for (let i = 0; i < portQuantity; i++) {
          const devices = central[where][i]

          if (devices['inputs'].length > 0) {
            const deviceSequence = devices['inputs'].findIndex((device: any) => device.projectDeviceId === deviceId)

            if (deviceSequence >= 0) {
              return deviceSequence
            }
          }
        }
      }

      return null
    },
    [menu]
  )

  const handleCheckDevicePort = useMemo(
    () => (deviceId: string, centralId: string, where: 'inputPorts' | 'outputPorts') => {
      const central = menu?.devices.find((central: DeviceProps) => central.projectDeviceId === centralId)
      if (central) {
        const portQuantity = central[where].length

        for (let i = 0; i < portQuantity; i++) {
          const devices = central[where][i]

          if (devices['inputs'].length > 0) {
            const deviceFound = devices['inputs'].findIndex((device: any) => device.projectDeviceId === deviceId)

            if (deviceFound >= 0) {
              return i
            }
          }
        }
      }

      return null
    },
    [menu]
  )

  const memoizedValues = useMemo(
    () => ({
      menu,
      loadingMenu,
      refreshMenu,
      setRefreshMenu,
      handleAvaliableInputPorts,
      handleAvaliableOutputPorts,
      handleCheckDeviceSequence,
      handleCheckDevicePort
    }),
    [
      handleAvaliableInputPorts,
      handleAvaliableOutputPorts,
      handleCheckDevicePort,
      handleCheckDeviceSequence,
      loadingMenu,
      menu,
      refreshMenu,
      setRefreshMenu
    ]
  )

  return <ProjectMenuContext.Provider value={memoizedValues}>{children}</ProjectMenuContext.Provider>
}

export { ProjectMenuProvider, ProjectMenuContext }
