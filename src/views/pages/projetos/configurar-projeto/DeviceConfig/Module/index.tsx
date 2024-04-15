import { useState } from 'react'

import {
  Box,
  Button,
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

import { useProjectMenu } from 'src/hooks/useProjectMenu'

import { checkPortName, checkSequenceIndex } from 'src/utils/project'

import toast from 'react-hot-toast'

import { api } from 'src/services/api'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  boardIndex: yup.string().required('Porta obrigatório'),
  index: yup.string().required('Sequência obrigatório')
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
  projectId: string
  centralId: string
  name: string
  modelName: string
  boardIndex: string
  index: string
  isCentral: boolean
  voiceActivation: boolean
}

interface ModuleProps {
  deviceData: any
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const Module = ({ deviceData, refresh, setRefresh }: ModuleProps) => {
  const theme = useTheme()

  const { handleAvaliableInputPorts, handleAvaliableOutputPorts, setRefreshMenu, refreshMenu } = useProjectMenu()

  const [selected, setSelected] = useState<number>(1)

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    values: {
      projectId: deviceData?.projectId,
      centralId: deviceData?.centralId,
      name: deviceData?.name,
      modelName: deviceData?.modelName,
      boardIndex: String(deviceData?.boardIndex),
      index: String(deviceData?.index),
      isCentral: deviceData?.isCentral,
      voiceActivation: deviceData?.voiceActivation
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleCheckDeviceTypeForAvailablePorts = (moduleType: string) => {
    if (moduleType === 'INPUT') {
      return handleAvaliableInputPorts(deviceData.centralId).map((port: any, index: number) => (
        <MenuItem key={index} value={port.port} disabled={!port.avaliable}>
          {checkPortName(Number(port?.port))}
        </MenuItem>
      ))
    }

    return handleAvaliableOutputPorts(deviceData.centralId).map((port: any, index: number) => (
      <MenuItem key={index} value={port.port} disabled={!port.avaliable}>
        {checkPortName(Number(port?.port))}
      </MenuItem>
    ))
  }

  const handleCheckDeviceTypeForAvailableSequence = (moduleType: string) => {
    if (moduleType === 'INPUT') {
      return handleAvaliableInputPorts(deviceData.centralId)[Number(watch('boardIndex'))]?.sequence.map(
        (sequence: any, index: number) => (
          <MenuItem key={index} value={sequence.index} disabled={!sequence.avaliable}>
            {checkSequenceIndex(sequence.index)}
          </MenuItem>
        )
      )
    }

    return handleAvaliableOutputPorts(deviceData.centralId)[Number(watch('boardIndex'))]?.sequence.map(
      (sequence: any, index: number) => (
        <MenuItem key={index} value={sequence.index} disabled={!sequence.avaliable}>
          {checkSequenceIndex(sequence.index)}
        </MenuItem>
      )
    )
  }

  const onSubmit = (formData: FormData) => {
    const data = formData

    Object.assign(data, {
      boardIndex: Number(formData.boardIndex),
      index: Number(formData.index)
    })

    api
      .put(`/projectDevices/${deviceData?._id}`, data)
      .then(response => {
        if (response.status === 200) {
          toast.success('Dados alterados com sucesso!')
          setRefresh(!refresh)
          setRefreshMenu(!refreshMenu)
        }
      })
      .catch(() => {
        toast.error('Erro ao alterar dados, tente novamente mais tarde')
      })
  }

  return (
    <Box>
      <CardHeader title={`Módulo: ${getValues('name')}`} />
      <CardContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='modelName'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Modelo do Módulo'
                    required
                    disabled
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.modelName)}
                    {...(errors.modelName && { helperText: errors.modelName.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    {deviceData?.modelName && <MenuItem value={deviceData.modelName}>{deviceData.modelName}</MenuItem>}
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
                    label='Nome'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Nome'
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='boardIndex'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Porta'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.boardIndex)}
                    {...(errors.boardIndex && { helperText: errors.boardIndex.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    {deviceData && handleCheckDeviceTypeForAvailablePorts(deviceData?.moduleType)}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='index'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Sequência'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.index)}
                    {...(errors.index && { helperText: errors.index.message })}
                  >
                    <MenuItem value=''>
                      <em>selecione</em>
                    </MenuItem>
                    {deviceData && watch('boardIndex')
                      ? handleCheckDeviceTypeForAvailableSequence(deviceData?.moduleType)
                      : null}
                  </CustomTextField>
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
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                  salvar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Box>
  )
}

export default Module
