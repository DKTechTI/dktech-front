// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

const CardOptionHorizontal = (props: any) => {
  const { icon, title, subtitle, avatarSize = 42, iconSize = '1.625rem', avatarColor = 'primary' } = props

  return (
    <Card>
      <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='h5' sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant='body2'>{subtitle}</Typography>
        </Box>
        <CustomAvatar skin='light' color={avatarColor} sx={{ width: avatarSize, height: avatarSize }}>
          <Icon icon={icon} fontSize={iconSize} />
        </CustomAvatar>
      </CardContent>
    </Card>
  )
}

export default CardOptionHorizontal
