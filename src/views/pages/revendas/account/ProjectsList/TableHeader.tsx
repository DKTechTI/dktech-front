import { CardHeader, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'
import CustomDatePicker from 'src/components/CustomDatePicker'

type DateType = Date | null | undefined

interface TableHeaderProps {
  nameValue: string | undefined
  statusValue: string | undefined
  createdValue: DateType
  updatedValue: DateType
  refresh: boolean
  setRefresh: (refresh: boolean) => void
  handleFilterName: (name: string) => void
  handleFilterStatus: (status: string) => void
  handleFilterCreated: (created: Date) => void
  handleFilterUpdated: (updated: Date) => void
}

const TableHeader = ({
  nameValue,
  statusValue,
  createdValue,
  updatedValue,
  handleFilterName,
  handleFilterStatus,
  handleFilterCreated,
  handleFilterUpdated
}: TableHeaderProps) => {
  return (
    <>
      <Grid container gap={3} paddingX={6} paddingY={4}>
        <Grid item xs={12}>
          <CardHeader
            sx={{
              padding: 0
            }}
            title='Projetos'
          />
        </Grid>

        <Grid container gap={4} justifyContent={'space-between'}>
          <Grid item xs={12} md={3}>
            <CustomTextField
              value={nameValue}
              placeholder='Buscar Projeto'
              onChange={e => handleFilterName(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomDatePicker value={createdValue} onChange={handleFilterCreated} placeholderText='Criado em' />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomDatePicker value={updatedValue} onChange={handleFilterUpdated} placeholderText='Atualizado em' />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label='status' value={statusValue ?? ''} onChange={e => handleFilterStatus(e.target.value)}>
                <MenuItem value=''>Todos</MenuItem>
                <MenuItem value='PUBLISHED'>Publicado</MenuItem>
                <MenuItem value='DRAFT'>Não Publicado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default TableHeader
