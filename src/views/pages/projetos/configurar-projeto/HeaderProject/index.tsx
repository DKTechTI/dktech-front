import { Box, Typography } from '@mui/material'

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
      <Typography variant='h4' component='h1' sx={{ width: 'fit-content', fontWeight: 700 }}>
        Projeto: {projectName}
      </Typography>
      <Typography variant='h5' component='h2' sx={{ width: 'fit-content', fontWeight: 700 }}>
        Cliente: {clientName}
      </Typography>
    </Box>
  )
}

export default HeaderProject
