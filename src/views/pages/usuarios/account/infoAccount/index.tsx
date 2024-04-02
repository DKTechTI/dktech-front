// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import { UserProps } from 'src/types/users'
import { ThemeColor } from 'src/@core/layouts/types'
import Chip from 'src/@core/components/mui/chip'
import { verifyUserStatus, verifyUserType } from 'src/@core/utils/user'

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  admin: 'info'
}
const statusColors: ColorsType = {
  active: 'success',
  inactive: 'secondary',
  blocked: 'error',
  pending: 'warning'
}

interface InfoAccountProps {
  data: UserProps
}

const InfoAccount = ({ data }: InfoAccountProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ padding: { xs: '20px 20px 20px !important', xl: '40px !important' }, width: '100%' }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              Informações
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ pt: 4 }}>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Nome:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>@ {data.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>E-mail:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                    <Chip
                      rounded
                      skin='light'
                      size='small'
                      label={verifyUserStatus(String(data.status).toLocaleLowerCase())}
                      color={statusColors[String(data.status).toLocaleLowerCase()]}
                      sx={{
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Tipo:</Typography>
                    <Chip
                      rounded
                      skin='light'
                      size='small'
                      label={verifyUserType(String(data.type).toLocaleLowerCase())}
                      color={roleColors[String(data.type).toLocaleLowerCase()]}
                      sx={{ textTransform: 'capitalize', mb: 4 }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InfoAccount
