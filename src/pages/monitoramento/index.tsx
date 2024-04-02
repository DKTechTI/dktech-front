import { useState } from 'react'

import {
  Box,
  Card,
  CardHeader,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@mui/material'

import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

interface DataType {
  id: string
  response: string
}

const data: DataType[] = [
  {
    id: '1',
    response: 'clicou aqui'
  },
  {
    id: '2',
    response: 'clicou aqui'
  },
  {
    id: '3',
    response: 'clicou aqui'
  },
  {
    id: '4',
    response: 'clicou aqui'
  },
  {
    id: '5',
    response: 'clicou aqui'
  }
]

const Monitorate = () => {
  const [deviceId, setDeviceId] = useState('')
  const [search, setSearch] = useState('')

  const handleOnSearch = (value: string) => {
    console.log('searching...')
    setDeviceId(value)
  }

  const handleOnRefresh = () => {
    setDeviceId('')
  }

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        <CardHeader title='Monitoramento' />
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', px: 4 }}>
          <CustomTextField sx={{ mr: 4 }} placeholder='id do dispositivo' onChange={e => setSearch(e.target.value)} />

          <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={() => handleOnSearch(search)}>
            <Icon fontSize='1.125rem' icon='tabler:eye-search' />
            Buscar
          </Button>
          <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={handleOnRefresh}>
            <Icon fontSize='1.125rem' icon='tabler:refresh' />
            refresh
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{ '& .MuiTableCell-root': { py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` } }}
            >
              <TableCell>dispositivo {deviceId}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: DataType) => {
              return (
                <TableRow
                  key={row.id}
                  sx={{
                    '& .MuiTableCell-root': { border: 0, py: theme => `${theme.spacing(2.25)} !important` },
                    '&:first-of-type .MuiTableCell-root': { pt: theme => `${theme.spacing(4.5)} !important` }
                  }}
                >
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      * {row.response}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

Monitorate.acl = {
  action: 'read',
  subject: 'client'
}

export default Monitorate
