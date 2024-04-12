import { useRouter } from 'next/router'

import { createContext, useState } from 'react'
import useGetDataApi from 'src/hooks/useGetDataApi'

type projectValuesType = {
  project: null | any
  loadingProject: boolean
  refreshProject: boolean
  setRefreshProject: (value: boolean) => void
  menu: null | any
  loadingMenu: boolean
  refreshMenu: boolean
  setRefreshMenu: (value: boolean) => void
  projectDeviceId: null | any
  setProjectDeviceId: (value: any) => void
  keyId: null | any
  setKeyId: (value: any) => void
  handleAvaliableInputPorts: (centralId: string) => any[]
  handleAvaliableOutputPorts: (centralId: string) => any[]
}

const defaultProvider: projectValuesType = {
  project: null,
  loadingProject: true,
  refreshProject: false,
  setRefreshProject: () => Boolean,
  menu: null,
  loadingMenu: true,
  refreshMenu: false,
  setRefreshMenu: () => Boolean,
  projectDeviceId: null,
  setProjectDeviceId: () => null,
  keyId: null,
  setKeyId: () => null,
  handleAvaliableInputPorts: () => [],
  handleAvaliableOutputPorts: () => []
}

const ProjectContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const ProjectProvider = ({ children }: Props) => {
  const router = useRouter()

  const { id } = router.query

  const [projectDeviceId, setProjectDeviceId] = useState<any>(null)
  const [keyId, setKeyId] = useState<any>(null)

  const {
    data: menu,
    refresh: refreshMenu,
    setRefresh: setRefreshMenu,
    loading: loadingMenu
  } = useGetDataApi<any>({ url: `/projects/menu/${id}`, callInit: router.isReady })

  const {
    data: project,
    refresh: refreshProject,
    setRefresh: setRefreshProject,
    loading: loadingProject
  } = useGetDataApi<any>({
    url: `/projects/${id}`,
    callInit: router.isReady
  })

  const handleAvaliableInputPorts = (centralId: string) => {
    const ports: any[] = []
    const sequenceLimit = 4
    const sequenceAvaliableDefaultValues: any[] = [
      {
        index: '0',
        avaliable: true
      },
      {
        index: '1',
        avaliable: true
      },
      {
        index: '2',
        avaliable: true
      },
      {
        index: '3',
        avaliable: true
      }
    ]

    const central = menu.devices.filter((device: any) => device.projectDeviceId === centralId)[0]

    const inputLimit = central.boardInputLimit

    for (let i = 0; i < inputLimit; i++) {
      if (i >= central.inputPorts.length) {
        ports.push({
          port: String(i),
          avaliable: true,
          sequence: sequenceAvaliableDefaultValues
        })
      } else {
        central.inputPorts.map((inputPort: any, index: number) => {
          const arraySequenceAvaliable = [...sequenceAvaliableDefaultValues]

          if (inputPort.order === i && inputPort.inputs.length >= sequenceLimit) {
            ports.push({
              port: String(index),
              avaliable: false,
              sequence: []
            })
          } else {
            ports.push({
              port: String(index),
              avaliable: true,
              sequence: []
            })
          }

          inputPort.inputs.map((input: any, indexInput: number) => {
            arraySequenceAvaliable[indexInput] = {
              index: String(input.order),
              avaliable: false
            }
          })

          ports[index].sequence = arraySequenceAvaliable

          i = index
        })
      }
    }

    return ports
  }

  const handleAvaliableOutputPorts = (centralId: string) => {
    const ports: any[] = []
    const sequenceLimit = 4
    const sequenceAvaliableDefaultValues: any[] = [
      {
        index: '0',
        avaliable: true
      },
      {
        index: '1',
        avaliable: true
      },
      {
        index: '2',
        avaliable: true
      },
      {
        index: '3',
        avaliable: true
      }
    ]

    const central = menu.devices.filter((device: any) => device.projectDeviceId === centralId)[0]

    const outputLimit = central.boardOutputLimit

    for (let i = 0; i < outputLimit; i++) {
      if (i >= central.outputPorts.length) {
        ports.push({
          port: String(i),
          avaliable: true,
          sequence: sequenceAvaliableDefaultValues
        })
      } else {
        central.outputPorts.map((outputPort: any, index: number) => {
          const arraySequenceAvaliable = [...sequenceAvaliableDefaultValues]

          if (outputPort.order === i && outputPort.inputs.length >= sequenceLimit) {
            ports.push({
              port: String(index),
              avaliable: false,
              sequence: []
            })
          } else {
            ports.push({
              port: String(index),
              avaliable: true,
              sequence: []
            })
          }

          outputPort.inputs.map((input: any, indexInput: number) => {
            arraySequenceAvaliable[indexInput] = {
              index: String(input.order),
              avaliable: false
            }
          })

          ports[index].sequence = arraySequenceAvaliable

          i = index
        })
      }
    }

    return ports
  }

  return (
    <ProjectContext.Provider
      value={{
        menu,
        loadingMenu,
        refreshMenu,
        setRefreshMenu,
        project,
        loadingProject,
        refreshProject,
        setRefreshProject,
        projectDeviceId,
        setProjectDeviceId,
        keyId,
        setKeyId,
        handleAvaliableInputPorts,
        handleAvaliableOutputPorts
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export { ProjectProvider, ProjectContext }
