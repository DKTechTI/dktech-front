import { Card, Grid, LinearProgress } from '@mui/material'

import { useProject } from 'src/hooks/useProject'

import Menu from 'src/views/pages/projetos/configurar-projeto/Menu'

import HeaderProject from './HeaderProject'
import DeviceConfig from './DeviceConfig'
import KeyConfig from './DeviceConfig/Keypad/KeyConfig'

export default function ProjectConfig() {
  const { project, projectDeviceId } = useProject()

  return (
    <Card>
      {project ? (
        HeaderProject({ projectName: project.data.name, clientName: project.data.clientName })
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
          sm={6}
          lg={5}
          sx={{
            minHeight: { xs: 'auto', md: '100vh' },
            border: '1px solid #D0D4F1'
          }}
        >
          {DeviceConfig({ projectDeviceId })}
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <KeyConfig />
        </Grid>
      </Grid>
    </Card>
  )
}
