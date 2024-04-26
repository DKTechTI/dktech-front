import { SyntheticEvent, useState } from 'react'

import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material'

import StatusKeys from './Status'

import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

interface KeyStatusProps {
  [key: string]: string
}

const keyStatusObj: KeyStatusProps = {
  ACTIVE: '#4caf50',
  INACTIVE: '#ef5350'
}

interface KeysProps {
  keys: any[]
}

const Keys = ({ keys }: KeysProps) => {
  const theme = useTheme()

  const { setKeyId, refreshDeviceKeys, setRefreshDeviceKeys } = useDeviceKeys()

  const [selected, setSelected] = useState<string>('')
  const [showDialogStatusKeys, setShowDialogStatusKeys] = useState<boolean>(false)

  const handleSelectKeyHighlight = (e: SyntheticEvent<HTMLElement>, id: string) => {
    e.stopPropagation()

    if (!id) return setSelected('')

    setSelected(id)
    setKeyId(id)
  }

  const handleShowKeys = (keys: any[]) => {
    return keys.map(key => {
      return (
        <ListItem
          key={key._id}
          disablePadding
          sx={{
            maxWidth: 300,
            width: '100%',
            margin: '0 auto',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: keyStatusObj[key?.status]
          }}
        >
          <ListItemButton
            id='keyButton'
            selected={selected === key._id}
            onClick={e => handleSelectKeyHighlight(e, key._id)}
            sx={{
              textAlign: 'center'
            }}
          >
            <ListItemText primary={key.name} />
          </ListItemButton>
        </ListItem>
      )
    })
  }

  return (
    <>
      <StatusKeys
        keys={keys}
        open={showDialogStatusKeys}
        handleClose={() => setShowDialogStatusKeys(false)}
        refresh={refreshDeviceKeys}
        setRefresh={setRefreshDeviceKeys}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
        <Grid container spacing={2} justifyContent={'space-between'}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5'>Configurações de teclas</Typography>
          </Grid>
          <Grid item xs={12} sm={6} xl={4}>
            <Button fullWidth variant='contained' onClick={() => setShowDialogStatusKeys(true)}>
              Status Tecla
            </Button>
          </Grid>
        </Grid>
        <List
          id='keysContainer'
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 3
          }}
          onClick={e => handleSelectKeyHighlight(e, '')}
        >
          {keys && handleShowKeys(keys)}
        </List>
      </Box>
    </>
  )
}

export default Keys
