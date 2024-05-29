// ** React Imports
import { useState, useCallback, useEffect } from 'react'

import { Typography, Grid, Card } from '@mui/material'
import { DataGrid, ptBR } from '@mui/x-data-grid'

import useGetDataApi from 'src/hooks/useGetDataApi'

import TableHeader from './TableHeader'
import { ProjectDataProps } from 'src/types/projects'
import { Columns } from './Columns'
import { formatDateFilter } from 'src/utils/filters'

interface projectListProps {
  resaleId: string
}

const ProjectsList = ({ resaleId }: projectListProps) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [projects, setProjects] = useState<any[]>([])
  const [name, setName] = useState<string>('')
  const [status, setStatus] = useState<string>()
  const [created, setCreated] = useState<Date>()
  const [updated, setUpdated] = useState<Date>()

  const { data, loading, error, setRefresh, refresh } = useGetDataApi<ProjectDataProps>({
    url: `/projects/by-reseller/${resaleId}`,
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

  const handleUpdateProjects = useCallback(
    (data: ProjectDataProps) => {
      const projectData = data.data

      setProjects(prevState => {
        const newProjects = Array.isArray(projectData)
          ? projectData.filter(newProject => !prevState.some(existingProject => existingProject._id === newProject._id))
          : []

        if (paginationModel.page === 0) {
          if (
            newProjects.length === 0 &&
            prevState.length === projectData.length &&
            prevState.every((project, index) => project._id === projectData[index]._id)
          ) {
            return prevState
          }

          return projectData
        }

        return [...prevState, ...newProjects]
      })
    },
    [paginationModel.page]
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
            columns={Columns()}
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
