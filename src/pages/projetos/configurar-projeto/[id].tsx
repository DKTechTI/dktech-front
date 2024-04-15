import { ActionsDnDProvider } from 'src/context/ActionsDnDContext'
import { DeviceKeysProvider } from 'src/context/DeviceKeysContext'
import { ProjectProvider } from 'src/context/ProjectContext'
import { ProjectMenuProvider } from 'src/context/ProjectMenuContext'
import ProjectConfigContent from 'src/views/pages/projetos/configurar-projeto'

const ProjectConfig = () => {
  return (
    <ProjectProvider>
      <ProjectMenuProvider>
        <DeviceKeysProvider>
          <ActionsDnDProvider>
            <ProjectConfigContent />
          </ActionsDnDProvider>
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
