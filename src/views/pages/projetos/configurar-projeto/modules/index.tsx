import {
  Box,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  useTheme
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  model: yup.string().required('Modelo obrigatório'),
  port: yup.string().required('Porta obrigatório'),
  sequence: yup.string().required('Seqüência obrigatório')
})

const keys = [
  {
    id: 1,
    name: 'luz mesa jantar',
    model: 'module_four'
  },
  {
    id: 2,
    name: 'luz mesa jantar',
    model: 'module_four'
  },
  {
    id: 3,
    name: 'luz mesa jantar',
    model: 'module_four'
  },
  {
    id: 4,
    name: 'luz mesa jantar',
    model: 'module_four'
  }
]

interface FormData {
  name: string
  model: string
  port: string
  sequence: string
}

const Modules = () => {
  const theme = useTheme()

  const [selected, setSelected] = useState<number>(1)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: 'luz mesa jantar',
      model: 'module_four_reles',
      port: 'A',
      sequence: 'Seq 2'
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Box>
      <CardHeader title='Módulo: Sala de Jantar' />
      <CardContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='model'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Modelo do Módulo'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.model)}
                    {...(errors.model && { helperText: errors.model.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    <MenuItem value='module_four_reles'>Módulo 4 relés</MenuItem>
                    <MenuItem value='module_eight_reles'>Módulo 8 relés</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='port'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Porta'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.port)}
                    {...(errors.port && { helperText: errors.port.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    <MenuItem value='A'>A</MenuItem>
                    <MenuItem value='B'>B</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='sequence'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Seqüência'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.sequence)}
                    {...(errors.sequence && { helperText: errors.sequence.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    <MenuItem value='Seq 1'>Seq 1</MenuItem>
                    <MenuItem value='Seq 2'>Seq 2</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Nome do Módulo'
                    required
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Módulo: Sala de Jantar'
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} justifyContent={'center'}>
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 3
                }}
                aria-label='keys'
              >
                {keys.map(item => (
                  <ListItem
                    key={item.id}
                    disablePadding
                    sx={{
                      maxWidth: 300,
                      width: '100%',
                      margin: '0 auto',
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <ListItemButton
                      selected={selected === item.id}
                      onClick={() => setSelected(item.id)}
                      sx={{
                        textAlign: 'center'
                      }}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                  salvar
                </Button>
              </Box>
            </Grid> */}
          </Grid>
        </form>
      </CardContent>
    </Box>
  )
}

export default Modules
