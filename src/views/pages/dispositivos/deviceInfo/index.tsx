import { SyntheticEvent, useState } from 'react'

import { useRouter } from 'next/router'

import { Box, CardActions, CardContent, MenuItem, Divider, Button, Card, Grid } from '@mui/material'

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import CustomTextField from 'src/@core/components/mui/text-field'

import DialogAlert from 'src/@core/components/dialogs/dialog-alert'

import toast from 'react-hot-toast'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

import { api } from 'src/services/api'

import { delay } from 'src/utils/delay'

import { DeviceProps } from 'src/types/devices'

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

interface DeviceInfoProps {
  data: DeviceProps
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const DeviceInfo = ({ data, refresh, setRefresh }: DeviceInfoProps) => {
  const router = useRouter()
  const { handleErrorResponse } = useErrorHandling()

  const [tabValue, setTabValue] = useState<string>(data.type)
  const [disableEdit, setDisableEdit] = useState<boolean>(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  const [moduleTypeInput] = useState<boolean>(data.moduleType === 'INPUT' ? true : false)

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: data,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const verifyDeviceType = (type: string, currentType: string) => {
    return type === currentType ? false : true
  }

  const handleTabsChange = (event: SyntheticEvent, newValue: 'CENTRAL' | 'KEYPAD' | 'MODULE') => {
    reset()

    setTabValue(newValue)
    setValue('type', newValue)

    switch (newValue) {
      case 'CENTRAL':
        setValue('moduleType', 'INOUT')
        setValue('operationType', 'NONE')
        break
      case 'KEYPAD':
        setValue('moduleType', 'INPUT')
        setValue('operationType', 'NONE')
        break
      case 'MODULE':
        setValue('moduleType', 'INPUT')
        setValue('operationType', 'DIMMER')
        break
    }

    clearErrors()
  }

  const handleConfirmDeleteDevice = (id: string) => {
    api
      .delete(`/devices/${id}`)
      .then(response => {
        if (response.status === 200) {
          setDeleteDialogOpen(false)
          toast.success('Dispositivo deletado com sucesso!')
          delay(2000).then(() => {
            router.push('/dispositivos')
          })
        }
      })
      .catch(error => {
        setDeleteDialogOpen(false)
        handleErrorResponse({
          error: error,
          errorReference: devicesErrors,
          defaultErrorMessage: 'Erro ao deletar dispositivo, tente novamente mais tarde.'
        })
      })
  }

  const onSubmit = (formData: FormData) => {
    api
      .put(`/devices/${data._id}`, formData)
      .then(response => {
        if (response.status === 200) {
          toast.success('Dispositivo atualizado com sucesso!')
          setRefresh(!refresh)
          setDisableEdit(true)
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: devicesErrors,
          defaultErrorMessage: 'Erro ao atualizar dispositivo, tente novamente mais tarde.'
        })
      })
  }

  return (
    <>
      <Card>
        <TabContext value={tabValue}>
          <TabList
            variant='scrollable'
            scrollButtons={false}
            onChange={handleTabsChange}
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, '& .MuiTab-root': { py: 3.5 } }}
          >
            <Tab value='CENTRAL' label='Central' disabled={verifyDeviceType('CENTRAL', data.type)} />
            <Tab value='KEYPAD' label='Keypad' disabled={verifyDeviceType('KEYPAD', data.type)} />
            <Tab value='MODULE' label='Módulo' disabled={verifyDeviceType('MODULE', data.type)} />
          </TabList>
          <form noValidate autoComplete='off'>
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
                          disabled={disableEdit}
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
                      name='status'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          disabled={disableEdit}
                          label='Status'
                          error={!!errors.status}
                          helperText={errors.status ? errors.status.message : ''}
                          {...field}
                        >
                          <MenuItem value=''>
                            <em>Selecione</em>
                          </MenuItem>
                          <MenuItem value='ACTIVE'>Ativo</MenuItem>
                          <MenuItem value='INACTIVE'>Inativo</MenuItem>
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
                          disabled={disableEdit}
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
                          disabled={disableEdit}
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
                          disabled={disableEdit}
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
                          disabled={disableEdit}
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
                          disabled={disableEdit}
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
                      name='status'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          disabled={disableEdit}
                          label='Status'
                          error={!!errors.status}
                          helperText={errors.status ? errors.status.message : ''}
                          {...field}
                        >
                          <MenuItem value=''>
                            <em>Selecione</em>
                          </MenuItem>
                          <MenuItem value='ACTIVE'>Ativo</MenuItem>
                          <MenuItem value='INACTIVE'>Inativo</MenuItem>
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
                          disabled={disableEdit}
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
                          disabled={disableEdit}
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
                      name='status'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          disabled={disableEdit}
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
                            disabled={disableEdit}
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
                              disabled={disableEdit}
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
                              disabled={disableEdit}
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
                {disableEdit ? (
                  <>
                    <Button color='error' variant='tonal' sx={{ mr: 2 }} onClick={() => setDeleteDialogOpen(true)}>
                      Deletar
                    </Button>
                    <Button variant='contained' onClick={() => setDisableEdit(!disableEdit)}>
                      Editar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant='outlined'
                      sx={{ mr: 2 }}
                      onClick={() => {
                        setDisableEdit(!disableEdit)
                        reset()
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button variant='contained' onClick={handleSubmit(onSubmit)}>
                      Salvar
                    </Button>
                  </>
                )}
              </Box>
            </CardActions>
          </form>
        </TabContext>
      </Card>

      <DialogAlert
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        question={'Você tem certeza que deseja deletar este dispositivo?'}
        description={'Esta ação não poderá ser desfeita.'}
        handleConfirmDelete={() => handleConfirmDeleteDevice(data._id)}
      />
    </>
  )
}

export default DeviceInfo
