import { Card, Grid, LinearProgress } from '@mui/material'

import { useProject } from 'src/hooks/useProject'

import Menu from 'src/views/pages/projetos/configurar-projeto/Menu'

import HeaderProject from './HeaderProject'
import DeviceConfig from './DeviceConfig'
import KeyConfig from './DeviceConfig/inputDevice/KeyConfig'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

export default function ProjectConfig() {
  const { project, projectDeviceId, loadingProject, refreshProject, setRefreshProject } = useProject()
  const { projectDeviceModuleType } = useDeviceKeys()

  return (
    <Card>
      {!loadingProject && project?.data ? (
        <HeaderProject data={project.data} refresh={refreshProject} setRefresh={setRefreshProject} />
      ) : (
        <LinearProgress
          sx={{
            margin: 3
          }}
        />
      )}
      <Grid container>
        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            padding: { xs: '10px 0', lg: '0' }
          }}
        >
          <Menu />
        </Grid>
        <Grid
          item
          xs={12}
          sm={projectDeviceModuleType === 'OUTPUT' ? 12 : 6}
          lg={projectDeviceModuleType === 'OUTPUT' ? 9 : 5}
          sx={{
            minHeight: { xs: 'auto', md: '100vh' },
            border: '1px solid #D0D4F1'
          }}
        >
          {DeviceConfig({ projectDeviceId })}
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          {projectDeviceModuleType === 'INPUT' && <KeyConfig />}
        </Grid>
      </Grid>
    </Card>
  )
}
