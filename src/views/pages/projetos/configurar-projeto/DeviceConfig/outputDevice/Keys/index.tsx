import { Box, Grid, List, ListItem, Typography } from '@mui/material'

import TryKey from './TryKey'

interface KeysProps {
  keys: any[]
  operationType: string
}

const Keys = ({ keys, operationType }: KeysProps) => {
  const handleShowKeys = (keys: any[], operationType: string) => {
    return keys.map((key: any, index: number) => {
      Object.assign(key, { order: String(index + 1), voiceActivation: 'true', operationType: operationType, initialValue: '0'})

      return (
        <ListItem
          key={key._id}
          disablePadding
          sx={{
            width: '100%',
            margin: '0 auto'
          }}
        >
          <TryKey keyData={key} operationType={operationType} />
        </ListItem>
      )
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}
    >
      <Grid container spacing={2} justifyContent={'space-between'}>
        <Grid item xs={12} sm={6}>
          <Typography variant='h5'>Testar Outputs</Typography>
        </Grid>
      </Grid>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3
        }}
      >
        {keys && handleShowKeys(keys, operationType)}
      </List>
    </Box>
  )
}

export default Keys
