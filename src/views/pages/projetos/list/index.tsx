// ** React Imports
import { useState, useCallback, useEffect } from 'react'

import { Typography, Grid, Card } from '@mui/material'
import { DataGrid, ptBR } from '@mui/x-data-grid'

import useGetDataApi from 'src/hooks/useGetDataApi'

import TableHeader from './TableHeader'
import { ProjectDataProps } from 'src/types/projects'
import { useAuth } from 'src/hooks/useAuth'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { Columns } from './Columns'
import { removeRowFromList } from 'src/utils/dataGrid'
import { formatDateFilter } from 'src/utils/filters'

const ProjectsList = () => {
  const { user } = useAuth()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [projects, setProjects] = useState<any[]>([])
  const [name, setName] = useState<string>('')
  const [status, setStatus] = useState<string>()
  const [created, setCreated] = useState<Date>()
  const [updated, setUpdated] = useState<Date>()

  const { data, loading, error, setRefresh, refresh } = useGetDataApi<ProjectDataProps>({
    url: `/projects/by-reseller/${user?.id}`,
    params: {
      page: paginationModel.page + 1,
      perPage: paginationModel.pageSize,
      search: name,
      status: status ? status : undefined,
      createdAt: created ? formatDateFilter(created) : undefined,
      updatedAt: updated ? formatDateFilter(updated) : undefined
    }
  })

  const handleFilterName = useCallback((val: string) => {
    setName(val)
  }, [])

  const handleFilterStatus = useCallback((val: string) => {
    setStatus(val)
  }, [])

  const handleFilterCreated = useCallback((val: Date) => {
    setCreated(val)
  }, [])

  const handleFilterUpdated = useCallback((val: Date) => {
    setUpdated(val)
  }, [])

  const handleConfirmDelete = (id: string) => {
    api
      .delete(`/projects/${id}`)
      .then(response => {
        if (response.status === 200) {
          const updatedListProjects = removeRowFromList(id, projects, '_id')
          setProjects(updatedListProjects)
          toast.success('Projeto deletado com sucesso!')
        }
      })
      .catch(() => {
        toast.error('Erro ao deletar projeto, tente novamente mais tarde')
      })
  }

  const handleUpdateProjects = useCallback(
    (data: ProjectDataProps) => {
      const projectData = data.data

      if ((paginationModel.page === 0 && name !== '') || name === '') setProjects([])

      setProjects(prevState => [
        ...prevState,
        ...(Array.isArray(projectData)
          ? projectData.filter(project => !prevState.some(existingProject => existingProject._id === project._id))
          : [])
      ])
    },
    [paginationModel.page, name]
  )

  useEffect(() => {
    if (data) handleUpdateProjects(data)
  }, [data, handleUpdateProjects])

  if (error) {
    return (
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              nameValue={name}
              handleFilterName={handleFilterName}
              statusValue={status}
              handleFilterStatus={handleFilterStatus}
              createdValue={created}
              handleFilterCreated={handleFilterCreated}
              updatedValue={updated}
              handleFilterUpdated={handleFilterUpdated}
              refresh={refresh}
              setRefresh={setRefresh}
            />
            <Typography
              variant='h4'
              align='center'
              sx={{
                padding: 20
              }}
            >
              {error?.message || 'Nenhum projeto encontrado.'}
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
          <TableHeader
            nameValue={name}
            handleFilterName={handleFilterName}
            statusValue={status}
            handleFilterStatus={handleFilterStatus}
            createdValue={created}
            handleFilterCreated={handleFilterCreated}
            updatedValue={updated}
            handleFilterUpdated={handleFilterUpdated}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row._id}
            loading={loading}
            columns={Columns({ handleConfirmDelete })}
            rows={projects}
            rowCount={data?.total}
            pageSizeOptions={[10]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            disableRowSelectionOnClick
            sx={{
              zIndex: '0 !important'
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProjectsList
