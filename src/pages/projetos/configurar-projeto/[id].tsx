import { DeviceKeysProvider } from 'src/context/DeviceKeysContext'
import { ProjectProvider } from 'src/context/ProjectContext'
import { ProjectMenuProvider } from 'src/context/ProjectMenuContext'
import ProjectConfigContent from 'src/views/pages/projetos/configurar-projeto'

const ProjectConfig = () => {
  return (
    <ProjectProvider>
      <ProjectMenuProvider>
        <DeviceKeysProvider>
          <ProjectConfigContent />
        </DeviceKeysProvider>
      </ProjectMenuProvider>
    </ProjectProvider>
  )
}

ProjectConfig.acl = {
  action: 'update',
  subject: 'client'
}

export default ProjectConfig
