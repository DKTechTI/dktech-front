import { createContext, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import useGetDataApi from 'src/hooks/useGetDataApi'

interface ProjectDataProps {
  _id: string
  resellerId: string
  clientId: string
  name: string
  clientName: string
  status: string
}

interface ProjectResponseProps {
  message: string
  data: ProjectDataProps
}

type projectValuesType = {
  project: null | ProjectResponseProps
  loadingProject: boolean
  refreshProject: boolean
  setRefreshProject: (value: boolean) => void
  projectDeviceId: null | any
  setProjectDeviceId: (value: any) => void
}

const defaultProvider: projectValuesType = {
  project: null,
  loadingProject: true,
  refreshProject: false,
  setRefreshProject: () => Boolean,
  projectDeviceId: null,
  setProjectDeviceId: () => null
}

const ProjectContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const ProjectProvider = ({ children }: Props) => {
  const router = useRouter()

  const { id } = router.query

  const [projectDeviceId, setProjectDeviceId] = useState<any>(null)

  const {
    data: project,
    refresh: refreshProject,
    setRefresh: setRefreshProject,
    loading: loadingProject,
    error: errorProject
  } = useGetDataApi<ProjectResponseProps>({
    url: `/projects/${id}`,
    callInit: router.isReady
  })

  useEffect(() => {
    if (!loadingProject) errorProject && router.push('/404')
  }, [errorProject, loadingProject, router])

  const memoizedValues = useMemo(
    () => ({
      project,
      loadingProject,
      refreshProject,
      setRefreshProject,
      projectDeviceId,
      setProjectDeviceId
    }),
    [loadingProject, project, projectDeviceId, refreshProject, setRefreshProject]
  )

  return <ProjectContext.Provider value={memoizedValues}>{children}</ProjectContext.Provider>
}

export { ProjectProvider, ProjectContext }
