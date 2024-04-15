import { useContext } from 'react'
import { ProjectMenuContext } from 'src/context/ProjectMenuContext'

export const useProjectMenu = () => useContext(ProjectMenuContext)
