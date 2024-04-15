import { useEffect, useState } from 'react'

import {
  Card,
  CardHeader,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Grid
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
    response: 'clicou aqui 1'
  },
  {
    id: '2',
    response: 'clicou aqui 2'
  },
  {
    id: '3',
    response: 'clicou aqui 3'
  },
  {
    id: '4',
    response: 'clicou aqui 4'
  },
  {
    id: '5',
    response: 'clicou aqui 5'
  },
  {
    id: '6',
    response: 'clicou aqui 6'
  },
  {
    id: '7',
    response: 'clicou aqui 7'
  },
  {
    id: '8',
    response: 'clicou aqui 8'
  },
  {
    id: '9',
    response: 'clicou aqui 9'
  },
  {
    id: '10',
    response: 'clicou aqui 10'
  },
  {
    id: '11',
    response: 'clicou aqui 11'
  },
  {
    id: '12',
    response: 'clicou aqui 12'
  },
  {
    id: '13',
    response: 'clicou aqui 13'
  }
]

const Monitorate = () => {
  const [deviceId, setDeviceId] = useState<string>('')
  const [search, setSearch] = useState('')
  const [renderedData, setRenderedData] = useState<DataType[]>([])

  const handleOnSearch = (value: string) => {
    setRenderedData([])
    setDeviceId(value)
  }

  const handleOnRefresh = () => {
    setRenderedData([])
    setDeviceId('')
  }

  const handleOnLog = (id: string) => {
    const lastLog = document.getElementById(id)
    if (lastLog) {
      lastLog.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
  }

  useEffect(() => {
    if (!deviceId) return

    const intervalId = setInterval(() => {
      if (renderedData.length >= data.length) {
        return () => clearInterval(intervalId)
      }

      const nextIndex = renderedData.length
      const nextItem = data[nextIndex]
      setRenderedData(prevRenderedData => [...prevRenderedData, nextItem])
    }, 3000)

    return () => clearInterval(intervalId)
  }, [renderedData, deviceId])

  useEffect(() => {
    if (renderedData.length > 0) {
      const lastItemId = renderedData[renderedData.length - 1].id
      handleOnLog(lastItemId)
    }
  }, [renderedData])

  return (
    <Card>
      <Grid container gap={3} paddingX={6} paddingY={4}>
        <Grid item xs={12}>
          <CardHeader
            sx={{
              padding: 0
            }}
            title='Monitoramento'
          />
        </Grid>

        <Grid container gap={4} justifyContent={'end'}>
          <Grid item xs={12} md={2}>
            <CustomTextField
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Buscar dispositivo'
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={() => handleOnSearch(search)} fullWidth>
              <Icon fontSize='1.125rem' icon='tabler:eye-search' />
              Buscar
            </Button>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={handleOnRefresh} fullWidth>
              <Icon fontSize='1.125rem' icon='tabler:refresh' />
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <TableContainer
        sx={{
          maxHeight: 500,
          height: '100% !important',
          overflowY: 'auto',
          '& .MuiTableCell-root': { borderBottom: 0 }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{ '& .MuiTableCell-root': { py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` } }}
            >
              <TableCell>dispositivo {deviceId}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!renderedData || renderedData.length === 0) && (
              <TableRow>
                <TableCell>
                  <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    {deviceId ? 'Buscando dados...' : 'Buscar um dispositivo para monitorar'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {renderedData.map((row: DataType) => {
              return (
                <TableRow
                  key={row.id}
                  id={row.id}
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
