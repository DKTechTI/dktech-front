import { useState, useCallback, useEffect } from 'react'

import { Typography, Grid, Card } from '@mui/material'
import { DataGrid, ptBR } from '@mui/x-data-grid'

import useGetDataApi from 'src/hooks/useGetDataApi'

import TableHeader from './TabHeader'

import toast from 'react-hot-toast'

import { DeviceDataProps, DeviceProps } from 'src/types/devices'

import { api } from 'src/services/api'
import { Columns } from './Columns'
import { removeRowFromList } from 'src/utils/dataGrid'

import devicesErrors from 'src/errors/devicesErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const DevicesList = () => {
  const { handleErrorResponse } = useErrorHandling()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [devices, setDevices] = useState<DeviceProps[]>([])
  const [value, setValue] = useState<string>('')

  const { data, loading, error } = useGetDataApi<DeviceDataProps>({
    url: '/devices',
    params: { page: paginationModel.page + 1, perPage: paginationModel.pageSize, search: value }
  })

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleConfirmDelete = (id: string) => {
    api
      .delete(`/devices/${id}`)
      .then(response => {
        if (response.status === 200) {
          const updatedListDevices = removeRowFromList(id, devices, '_id')
          setDevices(updatedListDevices)
          toast.success('Dispositivo deletado com sucesso!')
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: devicesErrors,
          defaultErrorMessage: 'Erro ao deletar dispositivo, tente novamente mais tarde.'
        })
      })
  }

  const handleUpdateDevices = useCallback(
    (data: DeviceDataProps) => {
      const devicesData = data.data

      if ((paginationModel.page === 0 && value !== '') || value === '') setDevices([])

      setDevices(prevState => [
        ...prevState,
        ...(Array.isArray(devicesData)
          ? devicesData.filter(newDevice => !prevState.some(existingDevice => existingDevice._id === newDevice._id))
          : [])
      ])
    },
    [paginationModel.page, value]
  )

  useEffect(() => {
    if (data) handleUpdateDevices(data)
  }, [data, handleUpdateDevices])

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
              {error?.message || 'Nenhum dispositivo encontrado.'}
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
            rows={devices}
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

export default DevicesList
