import Link from 'next/link'

import { Typography, Box } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

import RowOptions from './RowOptions'

import { ThemeColor } from 'src/@core/layouts/types'

import { GridColDef } from '@mui/x-data-grid'

import { renderDevicesInitials } from 'src/utils/dataGrid'
import { verifyDeviceStatus, verifyDeviceType, verifyModuleType } from 'src/utils/verifyDevice'

interface DeviceStatusType {
  [key: string]: ThemeColor
}

interface DevicesType {
  [key: string]: ThemeColor
}

interface CellType {
  row: any
}

const deviceStatusObj: DeviceStatusType = {
  active: 'success',
  inactive: 'secondary'
}

const deviceTypeObj: DevicesType = {
  INPUT: 'success',
  OUTPUT: 'secondary',
  INOUT: 'warning'
}

interface CreateColumnsProps {
  handleConfirmDelete: (id: string) => void
}

const Columns = ({ handleConfirmDelete }: CreateColumnsProps): GridColDef[] => [
  {
    flex: 0.15,
    minWidth: 210,
    field: 'modelName',
    headerName: 'Nome',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderDevicesInitials(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href={`/dispositivos/${row._id}`}
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {row.modelName}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'moduleType',
    minWidth: 210,
    headerName: 'Tipo',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={verifyModuleType(row.moduleType)}
          color={deviceTypeObj[row.moduleType]}
          sx={{ textTransform: 'capitalize', minWidth: 106 }}
        />
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 175,
    field: 'type',
    headerName: 'Modelo',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.secondary' }}>
            {verifyDeviceType(row.type)}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={verifyDeviceStatus(row.status)}
          color={deviceStatusObj[String(row.status).toLocaleLowerCase()]}
          sx={{ textTransform: 'capitalize', minWidth: 85 }}
        />
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 250,
    sortable: false,
    field: 'actions',
    headerName: 'Ações',
    renderCell: ({ row }: CellType) => <RowOptions id={row._id} handleConfirmDelete={handleConfirmDelete} />
  }
]

export { Columns }
