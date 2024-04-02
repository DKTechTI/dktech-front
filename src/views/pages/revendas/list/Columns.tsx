import Link from 'next/link'

import { Typography, Box } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

import RowOptions from './RowOptions'

import { ThemeColor } from 'src/@core/layouts/types'

import { GridColDef } from '@mui/x-data-grid'

import { formatDate } from 'src/@core/utils/format'
import { renderInitials } from 'src/utils/dataGrid'
import { verifyUserType, verifyUserStatus } from 'src/@core/utils/user'

interface ResalesStatusType {
  [key: string]: ThemeColor
}
interface CellType {
  row: any
}

const resaleStatusObj: ResalesStatusType = {
  active: 'success',
  inactive: 'secondary',
  blocked: 'error',
  pending: 'warning'
}

interface CreateColumnsProps {
  handleConfirmDelete: (id: string) => void
}

const Columns = ({ handleConfirmDelete }: CreateColumnsProps): GridColDef[] => [
  {
    flex: 0.15,
    minWidth: 210,
    field: 'name',
    headerName: 'Nome',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderInitials(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href={`/revendas/${row._id}`}
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {row.name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'email',
    minWidth: 210,
    headerName: 'E-mail',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.secondary' }}>
            {row.email}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 95,
    headerName: 'Perfil',
    field: 'role',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {verifyUserType(String(row.type).toLocaleLowerCase())}
        </Typography>
      )
    }
  },
  {
    type: 'date',
    flex: 0.15,
    minWidth: 175,
    field: 'CreatedAt',
    headerName: 'Data de Cadastro',
    valueGetter: ({ row }) => new Date(row.createdAt),
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {formatDate(row.createdAt)}
        </Typography>
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
          label={verifyUserStatus(String(row.status).toLocaleLowerCase())}
          color={resaleStatusObj[String(row.status).toLocaleLowerCase()]}
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
