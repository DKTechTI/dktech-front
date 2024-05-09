import { Box, Skeleton } from '@mui/material'
import { TreeView } from '@mui/x-tree-view/TreeView'

import Environments from './Environments'
import Devices from './Devices'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { useProjectMenu } from 'src/hooks/useProjectMenu'

export default function Menu() {
  const { menu } = useProjectMenu()

  const defaultExpandedValues = menu
    ? menu.devices
        .map((device: any) => device.projectDeviceId)
        .concat(menu.environments.map((environment: any) => environment.environmentId))
        .concat(['1', '2', '3'])
    : []

  return (
    <Box sx={{ flexGrow: 1, width: '100%', padding: '0 0 1rem 0' }}>
      {menu ? (
        <TreeView
          aria-label='rich object'
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={defaultExpandedValues}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {menu.devices ? <Devices devices={menu.devices} /> : null}
          {menu.environments ? <Environments environments={menu.environments} /> : null}
        </TreeView>
      ) : (
        <Box p={2}>
          <Skeleton animation='wave' />
          <Skeleton animation='wave' />
        </Box>
      )}
    </Box>
  )
}
