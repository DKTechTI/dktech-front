import { getInitials } from 'src/@core/utils/get-initials'
import CustomAvatar from 'src/@core/components/mui/avatar'

const removeRowFromList = (id: string, array: any[], param: string) => {
  return array.filter((item: any) => item[param] !== id)
}

const renderInitials = (row: any) => {
  return (
    <CustomAvatar
      skin='light'
      color={row.avatarColor}
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row.name)}
    </CustomAvatar>
  )
}

const renderDevicesInitials = (row: any) => {
  return (
    <CustomAvatar
      skin='light'
      color={row.avatarColor}
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row.modelName)}
    </CustomAvatar>
  )
}

export { removeRowFromList, renderInitials, renderDevicesInitials }
