import { Box, Grid, List, ListItem, Typography } from '@mui/material'

import TryKey from './TryKey'
import { handleCheckOperationType } from 'src/utils/actions'
import { useEffect, useRef } from 'react'

interface KeysProps {
  keys: any[]
  orderKeys: any
}

const Keys = ({ keys, orderKeys }: KeysProps) => {
  const keysRef = useRef<any>(null)

  useEffect(() => {
    if (keys && orderKeys) {
      const idToIndexMap: { [key: string]: number } = {}

      Object.entries(orderKeys).forEach(([index, id]) => {
        idToIndexMap[id as string] = parseInt(index as string)
      })

      keys.sort((a: any, b: any) => idToIndexMap[a._id] - idToIndexMap[b._id])

      keysRef.current = keys
    }
  }, [keys, orderKeys])

  const handleShowKeys = (keys: any[]) => {
    return keys.map((key: any, index: number) => {
      const operationType = handleCheckOperationType(key.initialValue)
      Object.assign(key, { order: String(index + 1) })

      return (
        <ListItem
          key={key._id}
          disablePadding
          sx={{
            width: '100%',
            margin: '0 auto'
          }}
        >
          <TryKey keyData={key} operationType={operationType || ''} />
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
        {keys && keysRef.current && handleShowKeys(keysRef.current)}
      </List>
    </Box>
  )
}

export default Keys