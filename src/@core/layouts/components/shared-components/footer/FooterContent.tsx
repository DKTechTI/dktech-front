import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, display: 'flex', color: 'text.secondary' }}>
        {`DK Tech © ${new Date().getFullYear()}, Todos os direitos reservados.`}
      </Typography>
    </Box>
  )
}

export default FooterContent
