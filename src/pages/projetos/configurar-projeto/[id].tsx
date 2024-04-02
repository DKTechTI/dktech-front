import { useState } from 'react'
import Menu from 'src/views/pages/projetos/configurar-projeto/menu'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Switch,
  Typography,
  useTheme
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import useGetDataApi from 'src/hooks/useGetDataApi'

const schemaModules = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  model: yup.string().required('Modelo obrigatório'),
  port: yup.string().required('Porta obrigatório'),
  sequence: yup.string().required('Seqüência obrigatório')
})

const schemaScenes = yup.object().shape({
  keyName: yup.string().required('Nome da tecla obrigatório'),
  keyType: yup.string().required('Tipo da tecla obrigatório'),
  keyEnviroment: yup.string().required('Ambiente da tecla obrigatório'),
  eventType: yup.string().required('Eventos obrigatório'),
  eventValue: yup.string().required('Valor do evento obrigatório'),
  sceneName: yup.string().required('Nome da cena obrigatório'),
  sceneType: yup.string().required('Tipo da cena obrigatório'),
  delay: yup.string().required('Delay obrigatório')
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

const acoes = [
  {
    id: 1,
    name: 'luz mesa jantar',
    order: 1,
    type: 'dimmer',
    action: '70'
  },
  {
    id: 2,
    name: 'delay',
    order: 2,
    type: null,
    action: '0.2'
  },
  {
    id: 3,
    name: 'luz corredor',
    order: 3,
    type: 'rele',
    action: 'on'
  }
]

interface FormDataModules {
  name: string
  model: string
  port: string
  sequence: string
}

interface FormDataScenes {
  keyName: string
  keyType: string
  keyEnviroment: string
  eventType: string
  eventValue: string
  sceneName: string
  sceneType: string
  delay: string
}

export default function ProjectConfig() {
  const theme = useTheme()

  const router = useRouter()

  const { data: project } = useGetDataApi<any>({ url: `/projects/${router.query.id}`, callInit: router.isReady })

  // const [name, setName] = useState<string>('')
  // const [open, setOpen] = useState<boolean>(true)

  const [selected, setSelected] = useState<number>(1)

  const [switchOptions, setSwitchOptions] = useState({
    loadingScene: true,
    toggleScene: false
  })

  const {
    control: controlModules,
    handleSubmit: handleSubmitModules,
    formState: { errors: errorsModules }
  } = useForm({
    defaultValues: {
      name: 'luz mesa jantar',
      model: 'module_four_reles',
      port: 'A',
      sequence: 'Seq 2'
    } as FormDataModules,
    mode: 'onBlur',
    resolver: yupResolver(schemaModules)
  })

  const {
    control: controlScenes,
    handleSubmit: handleSubmitScenes,
    getValues: getValuesScenes,
    setValue: setValueScenes,
    formState: { errors: errorsScenes }
  } = useForm({
    defaultValues: {
      keyName: 'luz mesa jantar',
      keyType: 'module_four_reles',
      eventType: '',
      eventValue: '',
      sceneName: 'luz mesa jantar',
      sceneType: 'module_four_reles',
      delay: '0.2'
    } as FormDataScenes,
    mode: 'onBlur',
    resolver: yupResolver(schemaScenes)
  })

  const onSubmitModules = (data: FormDataModules) => {
    console.log(data)
  }

  const onSubmitScenes = (data: FormDataScenes) => {
    console.log(data)
  }

  const handleSwitch = () => {
    setSwitchOptions({
      loadingScene: switchOptions.toggleScene,
      toggleScene: switchOptions.loadingScene
    })
  }

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {project && (
          <>
            <CardHeader
              title={`Nome do projeto: ${project.data.name}`}
              sx={{
                width: 'fit-content',
                cursor: 'pointer'
              }}
            />
            <CardHeader
              title={`Cliente: ${project.data.clientName}`}
              sx={{
                width: 'fit-content',
                cursor: 'pointer'
              }}
            />
          </>
        )}
      </Box>
      <Grid container>
        <Grid item xs={12} md={3}>
          <Menu />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box>
            <CardHeader title='Módulo: Sala de Jantar' />
            <CardContent>
              <form noValidate autoComplete='off' onSubmit={handleSubmitModules(onSubmitModules)}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='model'
                      control={controlModules}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label='Modelo do Módulo'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errorsModules.model)}
                          {...(errorsModules.model && { helperText: errorsModules.model.message })}
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
                      control={controlModules}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label='Porta'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errorsModules.port)}
                          {...(errorsModules.port && { helperText: errorsModules.port.message })}
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
                      control={controlModules}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label='Seqüência'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errorsModules.sequence)}
                          {...(errorsModules.sequence && { helperText: errorsModules.sequence.message })}
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
                      control={controlModules}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          label='Nome do Módulo'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          placeholder='Módulo: Sala de Jantar'
                          error={Boolean(errorsModules.name)}
                          {...(errorsModules.name && { helperText: errorsModules.name.message })}
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
                </Grid>
              </form>
            </CardContent>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box>
            <CardHeader title='Tecla: luz mesa jantar' />
            <CardContent>
              <form noValidate autoComplete='off' onSubmit={handleSubmitScenes(onSubmitScenes)}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Configuração da Tecla</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='keyName'
                      control={controlScenes}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          label='Nome da Tecla'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          placeholder='Módulo: Sala de Jantar'
                          error={Boolean(errorsScenes.keyName)}
                          {...(errorsScenes.keyName && { helperText: errorsScenes.keyName.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='keyType'
                      control={controlScenes}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label='Tipo da Tecla'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errorsScenes.keyType)}
                          {...(errorsScenes.keyType && { helperText: errorsScenes.keyType.message })}
                        >
                          <MenuItem value=''>
                            <em>selecione</em>
                          </MenuItem>
                          <MenuItem value='NA'>NA</MenuItem>
                          <MenuItem value='NF'>NF</MenuItem>
                          <MenuItem value='light_switch'>Interruptor</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='keyEnviroment'
                      control={controlScenes}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label='Ambiente da Tecla'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errorsScenes.keyEnviroment)}
                          {...(errorsScenes.keyEnviroment && { helperText: errorsScenes.keyEnviroment.message })}
                        >
                          <MenuItem value=''>
                            <em>selecione</em>
                          </MenuItem>
                          <MenuItem value='Sala de Estar'>Sala de Estar</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Informações da cena / evento</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='sceneName'
                      control={controlScenes}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          label='Nome da Cena'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          placeholder='Módulo: Sala de Jantar'
                          error={Boolean(errorsScenes.sceneName)}
                          {...(errorsScenes.sceneName && { helperText: errorsScenes.sceneName.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      select
                      fullWidth
                      label='Tipo de Evento'
                      required
                      value={getValuesScenes('eventType')}
                      onChange={(e: { target: { value: string } }) =>
                        setValueScenes('eventType', e.target.value, {
                          shouldValidate: true
                        })
                      }
                      error={Boolean(errorsScenes.eventType)}
                      {...(errorsScenes.eventType && { helperText: errorsScenes.eventType.message })}
                    >
                      <MenuItem value=''>
                        <em>selecione</em>
                      </MenuItem>
                      <MenuItem value='pulse_quantity'>Pulso</MenuItem>
                      <MenuItem value='press_time'>Tempo Pressionado</MenuItem>
                      <MenuItem value='is_repeat_event'>Repetição</MenuItem>
                    </CustomTextField>
                  </Grid>
                  {getValuesScenes('eventType') === 'pulse_quantity' && (
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='eventValue'
                        control={controlScenes}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            select
                            fullWidth
                            label='Quantidade de Pulsos'
                            required
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errorsScenes.eventValue)}
                            {...(errorsScenes.eventValue && { helperText: errorsScenes.eventValue.message })}
                          >
                            <MenuItem value=''>
                              <em>selecione</em>
                            </MenuItem>
                            <MenuItem value='1'>1 pulso</MenuItem>
                            <MenuItem value='2'>2 pulso</MenuItem>
                            <MenuItem value='3'>3 pulso</MenuItem>
                            <MenuItem value='4'>4 pulso</MenuItem>
                            <MenuItem value='5'>5 pulso</MenuItem>
                          </CustomTextField>
                        )}
                      />
                    </Grid>
                  )}
                  {getValuesScenes('eventType') === 'press_time' && (
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='eventValue'
                        control={controlScenes}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            select
                            fullWidth
                            label='Tempo Pressionado'
                            required
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errorsScenes.eventValue)}
                            {...(errorsScenes.eventValue && { helperText: errorsScenes.eventValue.message })}
                          >
                            <MenuItem value=''>
                              <em>selecione</em>
                            </MenuItem>
                            <MenuItem value='1'>1 segundo</MenuItem>
                            <MenuItem value='2'>2 segundos</MenuItem>
                            <MenuItem value='3'>3 segundos</MenuItem>
                            <MenuItem value='4'>4 segundos</MenuItem>
                            <MenuItem value='5'>5 segundos</MenuItem>
                          </CustomTextField>
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} alignSelf={'end'}>
                    <FormControlLabel
                      control={
                        <Switch checked={switchOptions.loadingScene} onChange={handleSwitch} name='loadingScene' />
                      }
                      label='Carregar Cena'
                    />
                    <FormControlLabel
                      control={
                        <Switch checked={switchOptions.toggleScene} onChange={handleSwitch} name='toggleScene' />
                      }
                      label='Toggle Cena'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name='delay'
                      control={controlScenes}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          type='number'
                          fullWidth
                          label='Delay'
                          required
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          placeholder='Delay'
                          inputProps={{ step: '0.1', min: '0.1' }}
                          error={Boolean(errorsScenes.delay)}
                          {...(errorsScenes.delay && { helperText: errorsScenes.delay.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} alignSelf={'end'}>
                    <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Delay
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Ações</Typography>
                  </Grid>
                  <Grid item xs={12} justifyContent={'start'}>
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
                      {acoes.map(item => (
                        <ListItem
                          key={item.id}
                          disablePadding
                          sx={{
                            minWidth: 150,
                            width: 'fit-content',
                            border: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <ListItemButton
                            sx={{
                              textAlign: 'center'
                            }}
                            selected={selected === item.id}
                            onClick={() => setSelected(item.id)}
                          >
                            <ListItemText primary={item.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                      <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
                        <Icon fontSize='1.125rem' icon='tabler:plus' />
                        Ação
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}

ProjectConfig.acl = {
  action: 'update',
  subject: 'client'
}
