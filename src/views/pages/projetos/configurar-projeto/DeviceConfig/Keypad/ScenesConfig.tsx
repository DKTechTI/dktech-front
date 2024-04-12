import { SyntheticEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  Typography
} from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

import ActionsConfig from './ActionsConfig'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { checkEventTypeValue, checkSceneTypeValue, formatSceneObject } from 'src/utils/scene'

// import useGetDataApi from 'src/hooks/useGetDataApi'

const sceneData: any = {
  data: {
    projectDeviceKeyId: 'jM5ZEpHlDlADsShmjjb3w',
    eventType: 'TIME_PRESSED',
    timePressed: 2,
    isRepeatEvent: false
  }
}

const schemaScene = yup.object().shape({
  name: yup.string().required('Nome da tecla obrigatório'),
  eventValue: yup.string().required('Tipo da tecla obrigatório'),
  sceneType: yup.string().required('Tipo da cena obrigatório')
})

interface FormDataScene {
  id: string | null
  projectId: string
  deviceId: string
  projectDeviceKeyId: string
  sceneType: string
  eventType: string
  eventValue: string
  pulseQuantity?: number
  timePressed?: number
  isRepeatEvent: boolean
  name: string
}

interface ScenesConfigProps {
  keyId: string
}

const ScenesConfig = ({ keyId }: ScenesConfigProps) => {
  const router = useRouter()

  const { id } = router.query

  const {
    control: controlScene,
    handleSubmit: handleSubmitScene,
    getValues: getValuesScene,
    setValue: setValueScene,

    // watch: watchScene,
    formState: { errors: errorsScene }
  } = useForm({
    values: {
      id: sceneData?.data?._id ?? null,
      projectId: id ?? '',
      deviceId: sceneData?.data?.deviceId,
      projectDeviceKeyId: sceneData?.data?.projectDeviceKeyId ?? keyId,
      name: sceneData?.data?.name,
      sceneType: sceneData?.data?.sceneType ?? 'LOAD',
      eventType: sceneData?.data?.eventType,
      eventValue: checkEventTypeValue(
        sceneData?.data?.eventType,
        sceneData?.data?.pulseQuantity ? sceneData?.data?.pulseQuantity : sceneData?.data?.timePressed
      ),
      pulseQuantity: sceneData?.data?.pulseQuantity ?? 0,
      timePressed: sceneData?.data?.timePressed ?? 0,
      isRepeatEvent: sceneData?.data?.isRepeatEvent
    } as FormDataScene,
    mode: 'onBlur',
    resolver: yupResolver(schemaScene)
  })

  // const { data } = useGetDataApi({
  //   url: `/projectScenes/${keyId}`,
  //   params: {
  //     eventType: watchScene('eventType'),
  //     eventValue: watchScene('eventValue')
  //   }
  // })

  const [switchOptions, setSwitchOptions] = useState({
    loadingScene: true,
    toggleScene: false,
    onOffScene: false
  })

  const handleSwitchSceneType = (sceneType: string) => {
    switch (sceneType) {
      case 'loadingScene':
        setSwitchOptions({
          loadingScene: true,
          toggleScene: false,
          onOffScene: false
        })
        setValueScene('sceneType', 'LOAD')

        return
      case 'toggleScene':
        setSwitchOptions({
          loadingScene: false,
          toggleScene: true,
          onOffScene: false
        })
        setValueScene('sceneType', 'TOGGLE')

        return
      case 'onOffScene':
        setSwitchOptions({
          loadingScene: false,
          toggleScene: false,
          onOffScene: true
        })
        setValueScene('sceneType', 'ON/OFF')

        return
      default:
        return switchOptions
    }
  }

  const handleChangeSceneEventValue = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement

    const pulseObj: { [key: string]: number } = {
      onePulse: 1,
      twoPulse: 2,
      threePulse: 3,
      fourPulse: 4,
      fivePulse: 5
    }

    const pressTimeObj: { [key: string]: number } = {
      twoTimePressed: 2,
      threeTimePressed: 3,
      fourTimePressed: 4,
      fiveTimePressed: 5
    }

    const repeatObj: { [key: string]: boolean } = {
      repeat: true
    }

    if (pulseObj[value]) {
      setValueScene('eventType', 'PULSE')
      setValueScene('eventValue', value)
      setValueScene('pulseQuantity', pulseObj[value])
      setValueScene('timePressed', 0)
      getValuesScene('isRepeatEvent') && setValueScene('isRepeatEvent', false)
    }

    if (pressTimeObj[value]) {
      setValueScene('eventType', 'TIME_PRESSED')
      setValueScene('eventValue', value)
      setValueScene('timePressed', pressTimeObj[value])
      setValueScene('pulseQuantity', 0)
      getValuesScene('isRepeatEvent') && setValueScene('isRepeatEvent', false)
    }

    if (repeatObj[value]) {
      setValueScene('eventType', 'REPEAT')
      setValueScene('eventValue', value)
      setValueScene('isRepeatEvent', repeatObj[value])
      setValueScene('pulseQuantity', 0)
      setValueScene('timePressed', 0)
    }
  }

  const onSubmitScene = (formData: FormDataScene) => {
    console.log(formData)
    console.log(formatSceneObject(formData))
  }

  useEffect(() => {
    if (sceneData?.data) {
      const sceneTypeValue = checkSceneTypeValue(sceneData?.data?.sceneType)
      handleSwitchSceneType(sceneTypeValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} sx={{ paddingTop: '0 !important' }}>
              <Typography variant='h6'>Informações da cena / evento</Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='name'
                control={controlScene}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Nome da Cena'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Nome da Cena'
                    error={Boolean(errorsScene.name)}
                    {...(errorsScene.name && { helperText: errorsScene.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='eventValue'
                control={controlScene}
                render={({ field: { value, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo de Evento'
                    required
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={e => handleChangeSceneEventValue(e)}
                    error={Boolean(errorsScene.eventValue)}
                    {...(errorsScene.eventValue && { helperText: errorsScene.eventValue.message })}
                  >
                    <MenuItem disabled value=''>
                      <em>Pulsos</em>
                    </MenuItem>
                    <MenuItem value='onePulse'>1 pulso</MenuItem>
                    <MenuItem value='twoPulse'>2 pulso</MenuItem>
                    <MenuItem value='threePulse'>3 pulso</MenuItem>
                    <MenuItem value='fourPulse'>4 pulso</MenuItem>
                    <MenuItem value='fivePulse'>5 pulso</MenuItem>
                    <MenuItem disabled value=''>
                      Tempo Pressionado
                    </MenuItem>
                    <MenuItem value='twoTimePressed'>2 segundos</MenuItem>
                    <MenuItem value='threeTimePressed'>3 segundos</MenuItem>
                    <MenuItem value='fourTimePressed'>4 segundos</MenuItem>
                    <MenuItem value='fiveTimePressed'>5 segundos</MenuItem>
                    <MenuItem disabled value=''>
                      Repetição
                    </MenuItem>
                    <MenuItem value='repeat'>Manter pressionado</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} alignSelf={'end'}>
              <FormControlLabel
                control={
                  <Switch
                    checked={switchOptions.loadingScene}
                    onChange={() => handleSwitchSceneType('loadingScene')}
                    name='loadingScene'
                  />
                }
                label='Carregar Cena'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={switchOptions.toggleScene}
                    onChange={() => handleSwitchSceneType('toggleScene')}
                    name='toggleScene'
                  />
                }
                label='Toggle Cena'
              />
              <FormControlLabel
                control={
                  <Switch
                    disabled
                    checked={switchOptions.onOffScene}
                    onChange={() => handleSwitchSceneType('onOffScene')}
                    name='onOffScene'
                  />
                }
                label='Ligar/Desligar Cena'
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            paddingBottom: '0px !important'
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'end' }}>
            <Button variant='contained' onClick={handleSubmitScene(onSubmitScene)}>
              Salvar
            </Button>
          </Box>
        </CardActions>
      </Card>
      <ActionsConfig />
    </Box>
  )
}

export default ScenesConfig
