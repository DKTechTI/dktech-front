import { SyntheticEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  MenuItem
} from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

import useGetDataApi from 'src/hooks/useGetDataApi'

// import toast from 'react-hot-toast'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// import { api } from 'src/services/api'

// import useErrorHandling from 'src/hooks/useErrorHandling'

import { useSocketIO } from 'src/hooks/useSocketIO'

const schema = yup.object().shape({
  centralId: yup.string().required('Central obrigatória')
})

interface DataType {
  message: string
  date: string
}

interface MonitoringProps {
  open: boolean
  handleClose: () => void
}

const Monitoring = ({ handleClose, open }: MonitoringProps) => {
  const router = useRouter()

  const { id } = router.query

  const { initializeSocket, socket } = useSocketIO()

  // const { handleErrorResponse } = useErrorHandling()

  const [renderedData, setRenderedData] = useState<DataType[]>([])
  const [centralId, setCentralId] = useState<string | null>(null)

  const { data: projectDevices } = useGetDataApi<any>({
    url: `/projectDevices/by-project/${id}`,
    callInit: router.isReady && open
  })

  const {
    control,
    reset,
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: { centralId: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleSetCentral = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement

    if (value) {
      setCentralId(value)
      setValue('centralId', value)
      clearErrors('centralId')

      return
    }

    setValue('centralId', value)
    setError('centralId', { type: 'manual', message: 'Central obrigatória' })
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
    if (!open) {
      reset()
      socket?.disconnect()
      setRenderedData([])
      setCentralId(null)

      return
    }

    centralId && initializeSocket('http://localhost:3002')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centralId, open])

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
  }, [socket, centralId])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='user-view-edit'
      aria-describedby='user-view-edit-description'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 1000 } }}
    >
      <DialogTitle
        id='user-view-edit'
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        Adicionar Dispositivo de Entrada
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Selecione o dispositivo de entrada que deseja adicionar e o ambiente que deseja associar
        </DialogContentText>
        <form noValidate autoComplete='off'>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Controller
                name='centralId'
                control={control}
                render={({ field: { value, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Central'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={e => handleSetCentral(e)}
                    error={Boolean(errors.centralId)}
                    {...(errors.centralId && { helperText: errors.centralId.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>selecione</em>
                    </MenuItem>
                    {projectDevices?.data.map((device: any) => {
                      if (device.type === 'CENTRAL') {
                        return (
                          <MenuItem key={device.centralId} value={device.centralId}>
                            {device.name}
                          </MenuItem>
                        )
                      }
                    })}
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
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
                <TableCell>Central</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!renderedData || renderedData.length === 0) && (
                <TableRow>
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {watch('centralId') ? 'Buscando dados...' : 'Escolha uma central para monitorar'}
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
      </DialogActions>
    </Dialog>
  )
}

export default Monitoring
