// ** React Imports
import { useState, useCallback, useEffect } from 'react'

import { Typography, Grid, Card } from '@mui/material'
import { DataGrid, ptBR } from '@mui/x-data-grid'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { api } from 'src/services/api'

import TableHeader from './TableHeader'

import toast from 'react-hot-toast'

import { useAuth } from 'src/hooks/useAuth'
import { removeRowFromList } from 'src/utils/dataGrid'

import { ClientDataProps, ClientProps } from 'src/types/clients'
import { Columns } from './Columns'

import clientsErrors from 'src/errors/clientsErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const ClientsList = () => {
  const { user } = useAuth()
  const { handleErrorResponse } = useErrorHandling()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [clients, setClients] = useState<ClientProps[]>([])
  const [value, setValue] = useState<string>('')

  const { data, loading, error } = useGetDataApi<ClientDataProps>({
    url: `/clients/by-reseller/${user?.id}`,
    params: { page: paginationModel.page + 1, perPage: paginationModel.pageSize, search: value }
  })

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleConfirmDelete = (id: string) => {
    api
      .delete(`/clients/${id}`)
      .then(response => {
        if (response.status === 200) {
          const updatedListClients = removeRowFromList(id, clients, '_id')
          setClients(updatedListClients)
          toast.success('Cliente deletado com sucesso!')
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: clientsErrors,
          defaultErrorMessage: 'Erro ao deletar cliente, tente novamente mais tarde.'
        })
      })
  }

  const handleUpdateClientes = useCallback(
    (data: ClientDataProps) => {
      const clientsData = data.data

      if ((paginationModel.page === 0 && value !== '') || (paginationModel.page === 0 && value === '')) setClients([])

      setClients(prevState => [
        ...prevState,
        ...(Array.isArray(clientsData)
          ? clientsData.filter(newClient => !prevState.some(existingUser => existingUser._id === newClient._id))
          : [])
      ])
    },
    [paginationModel.page, value]
  )

  useEffect(() => {
    if (data) handleUpdateClientes(data)
  }, [data, handleUpdateClientes])

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
              {error?.message || 'Nenhum cliente encontrado.'}
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
            rows={clients}
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

export default ClientsList
