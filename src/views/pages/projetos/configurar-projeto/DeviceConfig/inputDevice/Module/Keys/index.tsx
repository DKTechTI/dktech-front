import { memo, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'

import StatusKeys from './Status'
import toast from 'react-hot-toast'

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

const Keys = memo(({ keys }: KeysProps) => {
  const theme = useTheme()

  const { keyId, setKeyId, refreshDeviceKeys, setRefreshDeviceKeys, setKeyType } = useDeviceKeys()

  const [selected, setSelected] = useState<string>('')
  const [showDialogStatusKeys, setShowDialogStatusKeys] = useState<boolean>(false)

  const handleSelectCurrentKey = useCallback(
    (keyId: string | null) => {
      if (!keyId) return setSelected('')

      const key = keys.find(key => key._id === keyId)

      if (key && key.status === 'INACTIVE') return toast.error('Tecla inativa, não é possível selecionar')

      setSelected(keyId)
      setKeyId(keyId)
      key && setKeyType(key.keyType)
    },
    [keys, setKeyId, setKeyType]
  )

  const handleSelectKeyHighlight = useCallback(
    (e: SyntheticEvent<HTMLElement>, id: string) => {
      e.stopPropagation()

      handleSelectCurrentKey(id)
    },
    [handleSelectCurrentKey]
  )

  useEffect(() => {
    handleSelectCurrentKey(keyId)
  }, [handleSelectCurrentKey, keyId])

  const handleShowKeys = useMemo(
    () => (keys: any[]) => {
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
    },
    [handleSelectKeyHighlight, selected, theme.palette.divider]
  )

  return (
    <>
      {showDialogStatusKeys && (
        <StatusKeys
          keys={keys}
          open={showDialogStatusKeys}
          handleClose={() => setShowDialogStatusKeys(false)}
          refresh={refreshDeviceKeys}
          setRefresh={setRefreshDeviceKeys}
        />
      )}

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
        >
          {keys && handleShowKeys(keys)}
        </List>
      </Box>
    </>
  )
})

export default Keys
