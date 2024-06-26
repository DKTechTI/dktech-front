import { useState, useCallback, useEffect } from 'react'

import { DataGrid, ptBR } from '@mui/x-data-grid'
import { Typography, Grid, Card } from '@mui/material'

import { Columns } from './Columns'
import { removeRowFromList } from 'src/utils/dataGrid'

import TableHeader from 'src/views/pages/usuarios/list/TableHeader'

import useGetDataApi from 'src/hooks/useGetDataApi'

import toast from 'react-hot-toast'

import { UserDataProps, UserProps } from 'src/types/users'

import { api } from 'src/services/api'

import usersErrors from 'src/errors/usersErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const UsersList = () => {
  const { handleErrorResponse } = useErrorHandling()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [users, setUsers] = useState<UserProps[]>([])
  const [value, setValue] = useState<string>('')

  const { data, loading, error } = useGetDataApi<UserDataProps>({
    url: '/users?type=ADMIN',
    params: { page: paginationModel.page + 1, perPage: paginationModel.pageSize, search: value }
  })

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleConfirmDelete = async (id: string) => {
    api
      .delete(`/users/${id}`)
      .then(response => {
        if (response.status === 200) {
          const updatedListUsers = removeRowFromList(id, users, '_id')
          setUsers(updatedListUsers)
          toast.success('Usuário deletado com sucesso!')
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: usersErrors,
          defaultErrorMessage: 'Erro ao deletar usuário, tente novamente mais tarde.'
        })
      })
  }

  const handleUpdateUsers = useCallback(
    (data: UserDataProps) => {
      const usersData = data.data

      setUsers(prevState => {
        const newUsers = Array.isArray(usersData)
          ? usersData.filter(newUser => !prevState.some(existingUser => existingUser._id === newUser._id))
          : []

        if (paginationModel.page === 0) {
          if (
            newUsers.length === 0 &&
            prevState.length === usersData.length &&
            prevState.every((user, index) => user._id === usersData[index]._id)
          ) {
            return prevState
          }

          return usersData
        }

        return [...prevState, ...newUsers]
      })
    },
    [paginationModel.page]
  )

  useEffect(() => {
    if (data) handleUpdateUsers(data)
  }, [data, handleUpdateUsers])

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
              {error?.message || 'Nenhum usuário encontrado.'}
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
            rows={users}
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

export default UsersList
