import { useState, useEffect, useCallback } from 'react'
import {
  Typography,
  Backdrop,
  LinearProgress,
  Box,
  Button,
  List,
  ListItemText,
  ListItem,
  useTheme,
  LinearProgressProps
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

interface colorsStatusProps {
  [key: string]: LinearProgressProps['color']
}

const colorsStatus: colorsStatusProps = {
  true: 'success',
  false: 'error'
}

interface ErrorsProps {
  status: string
  reason: string
}

interface BackdropConfigProps {
  open: boolean
  handleClose: () => void
  success: boolean
  finished: boolean
  errors: ErrorsProps[]
}

const BackdropConfig = ({ open, handleClose, finished, success, errors }: BackdropConfigProps) => {
  const theme = useTheme()

  const [progress, setProgress] = useState(0)
  const [buffer, setBuffer] = useState(10)

  const handleShowError = (error: ErrorsProps) => {
    const centralId = error.reason.split(' ').pop()

    return `Erro ao enviar configuração para a central ${centralId}`
  }

  const updateProgress = useCallback(() => {
    setProgress(prevProgress => {
      if (prevProgress >= 100) {
        return 100
      }
      const diff = Math.random() * 10

      return prevProgress + diff
    })

    setBuffer(prevProgress => {
      const diff = Math.random() * 5
      const diff2 = Math.random() * 5
      const newBuffer = prevProgress + diff + diff2

      return newBuffer > 100 ? 100 : newBuffer
    })
  }, [])

  useEffect(() => {
    if (finished) {
      setProgress(100)
      setBuffer(100)
    }
  }, [finished])

  useEffect(() => {
    if (!finished) {
      const timer = setInterval(updateProgress, 60000)

      return () => {
        clearInterval(timer)
      }
    }
  }, [updateProgress, finished])

  return (
    <Backdrop
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 4,
        p: 4
      }}
      open={open}
    >
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {success ? (
                <CheckCircleIcon sx={{ fontSize: 120, color: 'green' }} />
              ) : (
                <ErrorIcon sx={{ fontSize: 120, color: '#EA5455' }} />
              )}
              <Typography variant='h4' sx={{ textAlign: 'center', color: '#D0D4F1' }}>
                {success ? 'Configuração realizada com sucesso' : 'Erro ao enviar configuração'}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <LinearProgress
          variant='buffer'
          value={progress}
          valueBuffer={buffer}
          color={(finished && colorsStatus[String(success)]) || 'primary'}
        />
      </Box>
      <Typography variant='h4' sx={{ textAlign: 'center', color: '#D0D4F1' }}>
        {!finished && 'Enviando Configuração...'}
      </Typography>
      {errors.length > 0 && (
        <Box sx={{ maxWidth: 600, width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <List
            sx={{
              bgcolor: '#fff',
              position: 'relative',
              overflow: 'auto',
              padding: 0,
              maxHeight: 177,
              borderRadius: 1
            }}
            subheader={<li />}
          >
            {errors.map((error, index) => (
              <ListItem
                key={index}
                sx={{
                  padding: 4,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <ListItemText
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#2F2B3DC7'
                    }
                  }}
                  primary={handleShowError(error)}
                />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end'
            }}
          >
            <Button
              variant='contained'
              onClick={handleClose}
              sx={{
                maxWidth: 150,
                width: '100%',
                marginTop: 2
              }}
            >
              Fechar
            </Button>
          </Box>
        </Box>
      )}
    </Backdrop>
  )
}

export default BackdropConfig
