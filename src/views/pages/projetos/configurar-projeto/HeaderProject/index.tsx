import { Box, Button, Chip, Typography, useMediaQuery } from '@mui/material'

interface HeaderProjectProps {
  projectName: string
  clientName: string
}

const HeaderProject = ({ clientName, projectName }: HeaderProjectProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1
      }}
    >
      <Typography variant='h5' component='h2' sx={{ width: 'fit-content', fontWeight: 700 }}>
        {clientName}
      </Typography>
      <Chip
        label={projectName}
        sx={{
          width: '8rem',
          height: '2rem',
          fontSize: 'medium'
        }}
      />
      <Button
        variant='contained'
        size='medium'
        sx={{
          width: {
            xs: '100%',
            sm: '100%',
            md: 'auto'
          }
        }}
      >
        Configurar Projeto
      </Button>
    </Box>
  )
}

export default HeaderProject
