import { SyntheticEvent, useState } from 'react'

import { Box, CardActions, CardContent, MenuItem, Divider, Button, Card, Grid } from '@mui/material'

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Controller, useForm } from 'react-hook-form'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { delay } from 'src/utils/delay'
import { useRouter } from 'next/router'

import devicesErrors from 'src/errors/devicesErrors'
import useErrorHandling from 'src/hooks/useErrorHandling'

const schema = yup.object().shape({
  modelName: yup.string().required('Nome é obrigatório'),
  type: yup.string().required('Tipo é obrigatório'),
  moduleType: yup.string().required('Tipo de Módulo é obrigatório'),
  operationType: yup.string().required('Tipo de Operação é obrigatório'),
  status: yup.string().required('Status é obrigatório'),
  inputPortsTotal: yup.number().when('type', ([type], schema) => {
    return type === 'CENTRAL' ? schema.required('Quantidade de Portas de Entrada é obrigatório') : schema.notRequired()
  }),
  inputTotal: yup.number().when(['type', 'moduleType'], ([type, moduleType], schema) => {
    return type === 'CENTRAL' || (type === 'MODULE' && moduleType === 'INPUT')
      ? schema.required('Quantidade de Entradas é obrigatório')
      : schema.notRequired()
  }),
  outputPortsTotal: yup.number().when('type', ([type], schema) => {
    return type === 'CENTRAL' ? schema.required('Quantidade de Portas de Saída é obrigatório') : schema.notRequired()
  }),
  outputTotal: yup.number().when(['type', 'moduleType'], ([type, moduleType], schema) => {
    return type === 'CENTRAL' || (type === 'MODULE' && moduleType === 'OUTPUT')
      ? schema.required('Quantidade de Saídas é obrigatório')
      : schema.notRequired()
  }),
  keysQuantity: yup.number().when('type', ([type], schema) => {
    return type === 'KEYPAD' ? schema.required('Quantidade de Teclas é obrigatório') : schema.notRequired()
  })
})

interface FormData {
  modelName: string
  type: string
  operationType: string
  moduleType: string
  status: string
  inputPortsTotal: number
  inputTotal: number
  outputPortsTotal: number
  outputTotal: number
  keysQuantity: number
}

const CreateDevice = () => {
  const router = useRouter()
  const { handleErrorResponse } = useErrorHandling()

  const [tabValue, setTabValue] = useState<string>('CENTRAL')
  const [moduleTypeInput, setModuleTypeInput] = useState<boolean>(true)

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    resetField,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: 'CENTRAL',
      moduleType: 'INOUT',
      operationType: 'NONE',
      status: 'ACTIVE'
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleTabsChange = (event: SyntheticEvent, newValue: string) => {
    reset()

    setTabValue(newValue)
    setValue('type', newValue)
    setValue('operationType', 'NONE')

    switch (newValue) {
      case 'CENTRAL':
        setValue('moduleType', 'INOUT')
        break
      case 'KEYPAD':
        setValue('moduleType', 'INPUT')
        break
      case 'MODULE':
        setValue('moduleType', 'INPUT')
        break
    }

    clearErrors()
  }

  const handleChangeModuleType = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement
    setValue('moduleType', value)

    if (value === 'INPUT') {
      setValue('operationType', 'NONE')
      resetField('outputTotal')
      setModuleTypeInput(true)

      return
    }

    resetField('inputTotal')
    setValue('operationType', 'DIMMER')
    setModuleTypeInput(false)
  }

  const onSubmit = (data: FormData) => {
    api
      .post('/devices', data)
      .then(response => {
        if (response.status === 201) {
          toast.success('Dispositivo adicionado com sucesso!')
          delay(2000).then(() => {
            router.push('/dispositivos')
          })
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: devicesErrors,
          defaultErrorMessage: 'Erro ao criar dispositivo, tente novamente mais tarde.'
        })
      })
  }

  return (
    <Card>
      <TabContext value={tabValue}>
        <TabList
          variant='scrollable'
          scrollButtons={false}
          onChange={handleTabsChange}
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, '& .MuiTab-root': { py: 3.5 } }}
        >
          <Tab value='CENTRAL' label='Central' />
          <Tab value='KEYPAD' label='Keypad' />
          <Tab value='MODULE' label='Módulo' />
        </TabList>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <TabPanel sx={{ p: 0 }} value='CENTRAL'>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Controller
                    name='modelName'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label='Nome'
                        placeholder='Nome'
                        error={!!errors.modelName}
                        helperText={errors.modelName ? errors.modelName.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='moduleType'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Tipo'
                        error={!!errors.moduleType}
                        helperText={errors.moduleType ? errors.moduleType.message : ''}
                        {...field}
                      >
                        <MenuItem value=''>
                          <em>Selecione</em>
                        </MenuItem>
                        <MenuItem value='INOUT'>Entrada/Saída</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Status'
                        error={!!errors.status}
                        helperText={errors.status ? errors.status.message : ''}
                        {...field}
                      >
                        <MenuItem value=''>
                          <em>Selecione</em>
                        </MenuItem>
                        <MenuItem value='ACTIVE'>Ativo</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='inputPortsTotal'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        type='number'
                        label='Total de Portas de Entradas'
                        placeholder='Total de Portas de Entradas'
                        inputProps={{ min: 0 }}
                        error={!!errors.inputPortsTotal}
                        helperText={errors.inputPortsTotal ? errors.inputPortsTotal.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='inputTotal'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        type='number'
                        label='Total de Entradas'
                        placeholder='Total de Entradas'
                        inputProps={{ min: 0 }}
                        error={!!errors.inputTotal}
                        helperText={errors.inputTotal ? errors.inputTotal.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='outputPortsTotal'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        type='number'
                        label='Total de Portas de Saídas'
                        placeholder='Total de Portas de Saídas'
                        inputProps={{ min: 0 }}
                        error={!!errors.outputPortsTotal}
                        helperText={errors.outputPortsTotal ? errors.outputPortsTotal.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='outputTotal'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        type='number'
                        label='Total de Saídas'
                        placeholder='Total de Saídas'
                        inputProps={{ min: 0 }}
                        error={!!errors.outputTotal}
                        helperText={errors.outputTotal ? errors.outputTotal.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='KEYPAD'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='modelName'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label='Nome'
                        placeholder='Nome'
                        error={!!errors.modelName}
                        helperText={errors.modelName ? errors.modelName.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='moduleType'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Tipo'
                        defaultValue='INPUT'
                        error={!!errors.type}
                        helperText={errors.type ? errors.type.message : ''}
                        {...field}
                      >
                        <MenuItem value=''>
                          <em>Selecione</em>
                        </MenuItem>
                        <MenuItem value='INPUT'>Entrada</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Status'
                        error={!!errors.status}
                        helperText={errors.status ? errors.status.message : ''}
                        {...field}
                      >
                        <MenuItem value=''>
                          <em>Selecione</em>
                        </MenuItem>
                        <MenuItem value='ACTIVE'>Ativo</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='keysQuantity'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        type='number'
                        label='Quantidade de Teclas'
                        placeholder='Quantidade de Teclas'
                        inputProps={{ min: 0 }}
                        error={!!errors.keysQuantity}
                        helperText={errors.keysQuantity ? errors.keysQuantity.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='MODULE'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='modelName'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label='Nome'
                        placeholder='Nome'
                        error={!!errors.modelName}
                        helperText={errors.modelName ? errors.modelName.message : ''}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='moduleType'
                    control={control}
                    render={({ field: { value } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Tipo'
                        value={value}
                        defaultValue='INPUT'
                        onChange={e => handleChangeModuleType(e)}
                        error={!!errors.moduleType}
                        helperText={errors.moduleType ? errors.moduleType.message : ''}
                      >
                        <MenuItem value=''>
                          <em>Selecione</em>
                        </MenuItem>
                        <MenuItem value='INPUT'>Entrada</MenuItem>
                        <MenuItem value='OUTPUT'>Saída</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Status'
                        error={!!errors.status}
                        helperText={errors.status ? errors.status.message : ''}
                        {...field}
                      >
                        <MenuItem value=''>
                          <em>Selecione</em>
                        </MenuItem>
                        <MenuItem value='ACTIVE'>Ativo</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                {moduleTypeInput ? (
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='inputTotal'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          type='number'
                          label='Total de Entradas'
                          placeholder='Total de Entradas'
                          inputProps={{ min: 0 }}
                          error={!!errors.inputTotal}
                          helperText={errors.inputTotal ? errors.inputTotal.message : ''}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='outputTotal'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            fullWidth
                            type='number'
                            label='Total de Saídas'
                            placeholder='Total de Saídas'
                            inputProps={{ min: 0 }}
                            error={!!errors.outputTotal}
                            helperText={errors.outputTotal ? errors.outputTotal.message : ''}
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='operationType'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            select
                            fullWidth
                            label='Tipo de Operação'
                            error={!!errors.operationType}
                            helperText={errors.operationType ? errors.operationType.message : ''}
                            {...field}
                          >
                            <MenuItem value=''>
                              <em>Selecione</em>
                            </MenuItem>
                            <MenuItem value='DIMMER'>Dimmer</MenuItem>
                            <MenuItem value='RELES'>Relés</MenuItem>
                            <MenuItem value='ENGINE'>Motor</MenuItem>
                          </CustomTextField>
                        )}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </TabPanel>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <CardActions>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
              <Button variant='outlined' sx={{ mr: 2 }} onClick={() => router.push('/dispositivos')}>
                Cancelar
              </Button>
              <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                Adicionar Dispositivo
              </Button>
            </Box>
          </CardActions>
        </form>
      </TabContext>
    </Card>
  )
}

CreateDevice.acl = {
  action: 'manage',
  subject: 'admin'
}

export default CreateDevice
