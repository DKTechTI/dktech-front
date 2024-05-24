import { SyntheticEvent, useCallback, useEffect, useState, useRef } from 'react'
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
  MenuItem,
  Button,
  Box
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useWebSocket } from 'src/hooks/useWebSocket'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
  centralId: yup.string().required('Central obrigatória')
})

interface MonitoringProps {
  open: boolean
  handleClose: () => void
}

const Monitoring = ({ handleClose, open }: MonitoringProps) => {
  const router = useRouter()
  const { id: projectId } = router.query

  const [centralId, setCentralId] = useState<string | null>(null)
  const [socketUrl, setSocketUrl] = useState<string | null>(null)

  const firstRender = useRef(true)

  const { data: projectDevices } = useGetDataApi<any>({
    url: `/projectDevices/by-project/${projectId}`,
    callInit: router.isReady && open
  })

  const { ws, readyState, messages, error, handleClearMessages } = useWebSocket({ url: socketUrl })

  const {
    control,
    reset,
    setValue,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: { centralId: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleReturnFeedback = (error: string, centralId: string) => {
    if (error) return error

    if (!centralId) return 'Escolha uma central para monitorar.'

    if (readyState !== WebSocket.OPEN && centralId) return 'Conexão Pausada.'

    return 'Buscando dados...'
  }

  const handleOnLog = (id: string) => {
    const lastLog = document.getElementById(id)
    if (lastLog) {
      lastLog.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
  }

  const handleSetCentral = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement

    if (value) {
      setCentralId(value)
      setValue('centralId', value)
      clearErrors('centralId')
      handleClearMessages()

      return
    }

    setValue('centralId', value)
    setError('centralId', { type: 'manual', message: 'Central obrigatória' })
  }

  const handleConnect = useCallback(() => {
    setSocketUrl(
      `${process.env.NEXT_PUBLIC_MQTT_URL}/${process.env.NEXT_PUBLIC_MQTT_PATH}?boardId=${centralId}&projectId=${projectId}`
    )
  }, [centralId, projectId])

  const handleDisconnect = useCallback(() => {
    if (readyState === WebSocket.OPEN && !firstRender.current) {
      ws?.close()
      setSocketUrl(null)
    }
  }, [readyState, ws])

  const handleConnection = () => {
    readyState === WebSocket.OPEN ? handleDisconnect() : handleConnect()
  }

  const handleSetDefaultValues = useCallback(() => {
    reset()
    setSocketUrl(null)
    setCentralId(null)
    handleClearMessages()
    handleDisconnect()
    firstRender.current = true
  }, [reset, handleClearMessages, handleDisconnect])

  useEffect(() => {
    if (messages.length > 0) {
      const lastItemId = messages[messages.length - 1].date
      handleOnLog(lastItemId)
    }
  }, [messages])

  useEffect(() => {
    if (!open && !firstRender.current) return handleSetDefaultValues()

    firstRender.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (centralId) handleConnect()
  }, [centralId, handleConnect])

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 1000 } }}>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        Monitoramento
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Selecione a central que deseja monitorar.
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
                    disabled={readyState === WebSocket.OPEN}
                    error={Boolean(errors.centralId)}
                    {...(errors.centralId && { helperText: errors.centralId.message })}
                  >
                    <MenuItem value='' disabled>
                      <em>selecione</em>
                    </MenuItem>
                    {projectDevices?.data.map((device: any) => {
                      if (device.type === 'CENTRAL') {
                        return (
                          <MenuItem key={device.centralId} value={device.boardId}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 2, mt: 4 }}>
          <Button variant='contained' onClick={handleClearMessages} disabled={!centralId}>
            Limpar Logs
          </Button>
          <Button variant='contained' onClick={handleConnection} disabled={!centralId || !!error}>
            {readyState === WebSocket.OPEN ? 'Parar' : 'Continuar'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <TableContainer
          sx={{
            maxHeight: 400,
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
                <TableCell>Central {centralId}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!messages || messages.length === 0) && (
                <TableRow>
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {handleReturnFeedback(error || '', centralId || '')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {messages.map(row => {
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
