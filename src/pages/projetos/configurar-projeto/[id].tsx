import { DeviceKeysProvider } from 'src/context/DeviceKeysContext'
import { ProjectProvider } from 'src/context/ProjectContext'
import ProjectConfigContent from 'src/views/pages/projetos/configurar-projeto'

const ProjectConfig = () => {
  return (
    <ProjectProvider>
      <DeviceKeysProvider>
        <ProjectConfigContent />
      </DeviceKeysProvider>
    </ProjectProvider>
  )
}

ProjectConfig.acl = {
  action: 'update',
  subject: 'client'
}

export default ProjectConfig
