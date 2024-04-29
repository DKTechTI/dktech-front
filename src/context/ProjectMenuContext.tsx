import { createContext } from 'react'

import { useRouter } from 'next/router'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'

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
}

type projectMenuValuesType = {
  menu: null | any
  loadingMenu: boolean
  refreshMenu: boolean
  setRefreshMenu: (value: boolean) => void
  handleAvaliableInputPorts: (centralId: string) => Promise<any[]>
  handleAvaliableOutputPorts: (centralId: string) => Promise<any[]>
}

const defaultProvider: projectMenuValuesType = {
  menu: null,
  loadingMenu: true,
  refreshMenu: false,
  setRefreshMenu: () => Boolean,
  handleAvaliableInputPorts: () => Promise.resolve([]),
  handleAvaliableOutputPorts: () => Promise.resolve([])
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
  } = useGetDataApi<any>({ url: `/projects/menu/${id}`, callInit: router.isReady })

  const handleAvaliableInputPorts = async (centralId: string) => {
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

        for (let i = 0; i < sequenceLimit; i++) {
          const isAvailable = central.indexMenuDevices.inputs[inputPort][i] === null

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
          sequence: arraySequenceAvaliable
        })
      })

      return ports
    } catch (error) {
      toast.error('Erro ao buscar dados do dispositivo central')

      return []
    }
  }

  const handleAvaliableOutputPorts = async (centralId: string) => {
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
            keysQuantityAvaliable--
          }
        }

        const arraySequenceAvaliable: SequenceProps[] = []

        for (let i = 0; i < sequenceLimit; i++) {
          const isAvailable = central.indexMenuDevices.outputs[outputPort][i] === null

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
          sequence: arraySequenceAvaliable
        })
      })

      return ports
    } catch (error) {
      toast.error('Erro ao buscar dados do dispositivo central')

      return []
    }
  }

  return (
    <ProjectMenuContext.Provider
      value={{
        menu,
        loadingMenu,
        refreshMenu,
        setRefreshMenu,
        handleAvaliableInputPorts,
        handleAvaliableOutputPorts
      }}
    >
      {children}
    </ProjectMenuContext.Provider>
  )
}

export { ProjectMenuProvider, ProjectMenuContext }
