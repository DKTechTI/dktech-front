import { ProjectProvider } from 'src/context/ProjectContext'
import { SocketIOProvider } from 'src/context/SocketIOContext'
import { AutoSaveProvider } from 'src/context/AutoSaveContext'
import { ActionsDnDProvider } from 'src/context/ActionsDnDContext'
import { DeviceKeysProvider } from 'src/context/DeviceKeysContext'
import { ProjectMenuProvider } from 'src/context/ProjectMenuContext'
import ProjectConfigContent from 'src/views/pages/projetos/configurar-projeto'

const ProjectConfig = () => {
  return (
    <ProjectProvider>
      <ProjectMenuProvider>
        <DeviceKeysProvider>
          <ActionsDnDProvider>
            <AutoSaveProvider>
              <SocketIOProvider>
                <ProjectConfigContent />
              </SocketIOProvider>
            </AutoSaveProvider>
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
