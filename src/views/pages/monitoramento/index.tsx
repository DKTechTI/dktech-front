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
import { useSocketIO } from 'src/hooks/useSocketIO'

interface DataType {
  message: string
  date: string
}

const MonitorateContent = () => {
  const { initializeSocket, socket } = useSocketIO()

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
    socket?.disconnect()
  }

  const handleOnLog = (id: string) => {
    const lastLog = document.getElementById(id)
    if (lastLog) {
      lastLog.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
  }

  useEffect(() => {
    if (renderedData.length > 0) {
      const lastItemId = renderedData[renderedData.length - 1].date
      handleOnLog(lastItemId)
    }
  }, [renderedData])

  useEffect(() => {
    initializeSocket('http://localhost:3002')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        socket.on('test', (data: any) => setRenderedData(prevRenderedData => [...prevRenderedData, data]))
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [socket])

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
                  key={row.date}
                  id={row.date}
                  sx={{
                    '& .MuiTableCell-root': { border: 0, py: theme => `${theme.spacing(2.25)} !important` },
                    '&:first-of-type .MuiTableCell-root': { pt: theme => `${theme.spacing(4.5)} !important` }
                  }}
                >
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      * {row.message}
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

export default MonitorateContent
