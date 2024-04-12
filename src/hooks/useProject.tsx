import { useContext } from 'react'
import { ProjectContext } from 'src/context/ProjectContext'

export const useProject = () => useContext(ProjectContext)
