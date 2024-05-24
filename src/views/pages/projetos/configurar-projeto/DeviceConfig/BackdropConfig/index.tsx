import { useState, useEffect, useCallback } from 'react'
import { Typography, Backdrop, LinearProgress, Box } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

interface BackdropConfigProps {
  open: boolean
  success?: boolean
  finished?: boolean
}

const BackdropConfig = ({ open, finished, success }: BackdropConfigProps) => {
  const [progress, setProgress] = useState(0)
  const [buffer, setBuffer] = useState(10)

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
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        p: 3
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
            {success ? (
              <CheckCircleIcon sx={{ fontSize: 120, color: 'green' }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 120, color: 'red' }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
      </Box>
      <Typography variant='h4' sx={{ mt: 2, textAlign: 'center' }}>
        {finished
          ? success
            ? 'Configuração realizada com sucesso'
            : 'Erro ao enviar configuração'
          : 'Enviando Configuração...'}
      </Typography>
    </Backdrop>
  )
}

export default BackdropConfig
