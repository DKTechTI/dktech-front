import { Typography, Box } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

import { ThemeColor } from 'src/@core/layouts/types'

import { GridColDef } from '@mui/x-data-grid'

import { formatDate } from 'src/@core/utils/format'
import { renderInitials } from 'src/utils/dataGrid'
import { formatName } from 'src/utils/formatName'
import { verifyProjectStatus } from 'src/utils/verifyProject'

interface ProjectStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: any
}

const projectStatusObj: ProjectStatusType = {
  PUBLISHED: 'success',
  DRAFT: 'secondary'
}

const Columns = (): GridColDef[] => [
  {
    flex: 0.15,
    minWidth: 210,
    field: 'name',
    headerName: 'Projeto',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderInitials(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              sx={{
                color: 'text.secondary'
              }}
            >
              {formatName(row.name)}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 175,
    field: 'clientName',
    headerName: 'Cliente',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              sx={{
                color: 'text.secondary'
              }}
            >
              {formatName(row.name)}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    type: 'date',
    flex: 0.15,
    minWidth: 175,
    field: 'createdAt',
    headerName: 'Criado em',
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
    type: 'date',
    flex: 0.15,
    minWidth: 175,
    headerName: 'Atualizado em',
    field: 'updatedAt',
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
          label={verifyProjectStatus(row.status)}
          color={projectStatusObj[row.status]}
          sx={{ textTransform: 'capitalize', minWidth: 85 }}
        />
      )
    }
  }
]

export { Columns }
