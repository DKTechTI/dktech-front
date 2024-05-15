// ** React Imports
import { useState, useCallback, useEffect } from 'react'

import { Typography, Grid, Card } from '@mui/material'
import { DataGrid, ptBR } from '@mui/x-data-grid'

import TableHeader from './TableHeader'
import { ResaleDataProps, ResaleProps } from 'src/types/resales'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { Columns } from './Columns'
import useGetDataApi from 'src/hooks/useGetDataApi'
import { removeRowFromList } from 'src/utils/dataGrid'

import usersErrors from 'src/errors/usersErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const ResaleUsersList = () => {
  const { handleErrorResponse } = useErrorHandling()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [resales, setResales] = useState<ResaleProps[]>([])
  const [value, setValue] = useState<string>('')

  const { data, loading, error } = useGetDataApi<ResaleDataProps>({
    url: '/users?type=CLIENT',
    params: { page: paginationModel.page + 1, perPage: paginationModel.pageSize, search: value }
  })

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleConfirmDelete = (id: string) => {
    api
      .delete(`/users/${id}`)
      .then(response => {
        if (response.status === 200) {
          const updatedListResales = removeRowFromList(id, resales, '_id')
          setResales(updatedListResales)
          toast.success('Revenda deletada com sucesso!')
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: usersErrors,
          defaultErrorMessage: 'Erro ao deletar revenda, tente novamente mais tarde.'
        })
      })
  }

  const handleUpdateResales = useCallback(
    (data: ResaleDataProps) => {
      const resalesData = data.data

      if ((paginationModel.page === 0 && value !== '') || value === '') setResales([])

      setResales(prevState => [
        ...prevState,
        ...(Array.isArray(resalesData)
          ? resalesData.filter(newResale => !prevState.some(existingResale => existingResale._id === newResale._id))
          : [])
      ])
    },
    [paginationModel.page, value]
  )

  useEffect(() => {
    if (data) handleUpdateResales(data)
  }, [data, handleUpdateResales])

  if (error) {
    return (
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} />
            <Typography
              variant='h4'
              align='center'
              sx={{
                padding: 20
              }}
            >
              {error?.message || 'Nenhuma revenda encontrada.'}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row._id}
            loading={loading}
            columns={Columns({ handleConfirmDelete })}
            rows={resales}
            rowCount={data?.total}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            disableRowSelectionOnClick
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ResaleUsersList
