// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import { ThemeColor } from 'src/@core/layouts/types'
import Chip from 'src/@core/components/mui/chip'
import { ResaleProps } from 'src/types/resales'

import { formatDocumentNumber } from 'src/utils/formatDocumentNumber'
import verifyDataValue from 'src/utils/verifyDataValue'
import { verifyUserStatus } from 'src/@core/utils/user'

interface ColorsType {
  [key: string]: ThemeColor
}
const statusColors: ColorsType = {
  active: 'success',
  inactive: 'secondary',
  blocked: 'error',
  pending: 'warning'
}

interface InfoAccountProps {
  data: ResaleProps
}

const InfoResaleAccount = ({ data }: InfoAccountProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ padding: { xs: '20px 20px 20px !important', xl: '40px !important' }, width: '100%' }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              Informações
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6} xl={6}>
                <Box sx={{ pt: 4 }}>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Nome:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>@ {data.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Nome da Empresa:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{verifyDataValue(data.companyName)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>E-mail:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Documento:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {formatDocumentNumber(data?.documentNumber, data.documentType)}
                    </Typography>
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
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                      Inscrição Estadual:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{verifyDataValue(data.stateRegistration)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                      Inscrição Municipal:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {verifyDataValue(data.municipalRegistration)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} lg={6} xl={6} paddingTop={{ xs: '0 !important', xl: '8px !important' }}>
                <Box sx={{ pt: { xl: 4 } }}>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>CEP:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data.cep}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Endereço:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {data.address}, {data.number}, {data.complement}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Bairro:</Typography>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                      {data.neighborhood}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Cidade:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data.city}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Estado:</Typography>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{data.state}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Telefone:</Typography>
                    <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                      {verifyDataValue(data.cellphone)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Telefone fixo:</Typography>
                    <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                      {verifyDataValue(data.phone)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                      Transportadora Preferencial:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{verifyDataValue(data.referenceCarrier)}</Typography>
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

export default InfoResaleAccount
