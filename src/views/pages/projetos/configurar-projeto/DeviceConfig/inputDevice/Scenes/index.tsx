import { SyntheticEvent, useCallback, useEffect, useState } from 'react'

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

import ActionsConfig from '../Actions/Config'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useGetDataApi from 'src/hooks/useGetDataApi'
import { useActionsDnD } from 'src/hooks/useActionsDnD'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import {
  checkEventTypeValue,
  checkSceneTypeValue,
  formatEventTypeForRequest,
  formatEventValueForRequest,
  formatSceneObject
} from 'src/utils/scene'

import toast from 'react-hot-toast'
import { useAutoSave } from 'src/hooks/useAutoSave'

const schemaScene = yup.object().shape({
  name: yup.string().required('Nome da cena obrigatório'),
  eventValue: yup.string().required('Tipo de evento obrigatório'),
  ledAction: yup.string().required('Led de ação obrigatório'),
  sceneType: yup.string().required('Tipo da cena obrigatório')
})

interface FormDataScene {
  sceneId: string | null
  projectId: string
  deviceId: string
  projectDeviceKeyId: string
  sceneType: string
  eventType: string
  eventValue: string
  pulseQuantity?: number
  timePressed?: number
  ledAction: string
  isRepeatEvent: boolean
  name: string
}

interface ScenesProps {
  keyId: string
}

const Scenes = ({ keyId }: ScenesProps) => {
  const router = useRouter()

  const { id } = router.query

  const { handleSaveOnStateChange } = useAutoSave()
  const { deviceId, projectDeviceType } = useDeviceKeys()
  const { setProjectSceneId, setOrderActions } = useActionsDnD()

  const {
    control: controlScene,
    handleSubmit: handleSubmitScene,
    getValues: getValuesScene,
    setValue: setValueScene,
    reset: resetScene,
    watch: watchScene,
    formState: { errors: errorsScene }
  } = useForm({
    defaultValues: {
      projectId: id as string,
      deviceId: deviceId,
      projectDeviceKeyId: keyId,
      sceneType: 'LOAD',
      eventType: 'PULSE',
      eventValue: 'onePulse',
      isRepeatEvent: false
    } as FormDataScene,
    mode: 'onBlur',
    resolver: yupResolver(schemaScene)
  })

  const { data: sceneData, error } = useGetDataApi<any>({
    url: `/projectScenes/by-event-type/${keyId}`,
    params: {
      eventType: formatEventTypeForRequest(watchScene('eventValue')),
      value: formatEventValueForRequest(watchScene('eventValue'))
    },
    callInit: Boolean(keyId && watchScene('eventValue'))
  })

  const [switchOptions, setSwitchOptions] = useState({
    loadingScene: true,
    toggleScene: false,
    onOffScene: false
  })

  const handleCheckIsEmpty = (data: any) => {
    return Object.keys(data).length === 0
  }

  const handleChangeEventType = async (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement

    resetScene()

    setSwitchOptions({
      loadingScene: true,
      toggleScene: false,
      onOffScene: false
    })

    setValueScene('eventValue', target.value)
  }

  const handleEventValueForRequest = async (eventValue: string) => {
    return new Promise<void>((resolve, reject) => {
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

      if (pulseObj[eventValue]) {
        setValueScene('eventType', 'PULSE')
        setValueScene('eventValue', eventValue)
        setValueScene('pulseQuantity', pulseObj[eventValue])
        setValueScene('timePressed', 0)
        getValuesScene('isRepeatEvent') && setValueScene('isRepeatEvent', false)

        return resolve()
      }

      if (pressTimeObj[eventValue]) {
        setValueScene('eventType', 'TIME_PRESSED')
        setValueScene('eventValue', eventValue)
        setValueScene('timePressed', pressTimeObj[eventValue])
        setValueScene('pulseQuantity', 0)
        getValuesScene('isRepeatEvent') && setValueScene('isRepeatEvent', false)

        return resolve()
      }

      if (repeatObj[eventValue]) {
        setValueScene('eventType', 'REPEAT')
        setValueScene('eventValue', eventValue)
        setValueScene('isRepeatEvent', repeatObj[eventValue])
        setValueScene('pulseQuantity', 0)
        setValueScene('timePressed', 0)

        return resolve()
      }

      return reject(new Error('Invalid eventValue'))
    })
  }

  const onSubmitScene = (formData: FormDataScene) => {
    handleEventValueForRequest(formData.eventValue).then(() => {
      const responseMessage: { [key: number]: string } = {
        201: 'Cena criada com sucesso!',
        200: 'Cena atualizada com sucesso!',
        404: 'Erro ao criar cena, tente novamente mais tarde',
        409: 'Erro ao criar cena, tente novamente mais tarde',
        500: 'Erro ao criar cena, tente novamente mais tarde'
      }

      const data = formatSceneObject(getValuesScene())

      handleSaveOnStateChange(`/projectScenes`, data, 'PATCH').then(response => {
        if (response) {
          if (response.status >= 200) {
            toast.success(responseMessage[response.status])
            setProjectSceneId(response.data.data._id)

            return
          }

          toast.error(responseMessage[response.status])
        }
      })
    })
  }

  const handleSwitchSceneType = useCallback(
    (sceneType: string) => {
      switch (sceneType) {
        case 'loadingScene':
          setSwitchOptions({
            loadingScene: true,
            toggleScene: false,
            onOffScene: false
          })
          setValueScene('sceneType', 'LOAD')
          if (handleCheckIsEmpty(errorsScene)) onSubmitScene(watchScene())

          return
        case 'toggleScene':
          setSwitchOptions({
            loadingScene: false,
            toggleScene: true,
            onOffScene: false
          })
          setValueScene('sceneType', 'TOGGLE')
          if (handleCheckIsEmpty(errorsScene)) onSubmitScene(watchScene())

          return
        case 'onOffScene':
          setSwitchOptions({
            loadingScene: false,
            toggleScene: false,
            onOffScene: true
          })
          setValueScene('sceneType', 'ON/OFF')
          if (handleCheckIsEmpty(errorsScene)) onSubmitScene(watchScene())

          return
        default:
          return switchOptions
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValueScene, switchOptions]
  )

  useEffect(() => {
    if (error?.response?.status === 404) setProjectSceneId(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  useEffect(() => {
    if (sceneData?.data) {
      setValueScene('sceneId', sceneData.data?._id)
      setValueScene('deviceId', sceneData.data?.deviceId)
      setValueScene('name', sceneData.data?.name)
      setValueScene('eventType', sceneData.data?.eventType)
      setValueScene('sceneType', sceneData.data?.sceneType)
      setValueScene('isRepeatEvent', sceneData.data?.isRepeatEvent)
      setValueScene(
        'eventValue',
        checkEventTypeValue(
          sceneData?.data?.eventType,
          sceneData?.data?.pulseQuantity ? sceneData?.data?.pulseQuantity : sceneData?.data?.timePressed
        )
      )

      const sceneTypeValue = checkSceneTypeValue(sceneData?.data?.sceneType)
      handleSwitchSceneType(sceneTypeValue)
      setProjectSceneId(sceneData.data?._id)
      sceneData.data.indexActions ? setOrderActions(sceneData.data.indexActions) : setOrderActions(null)

      return
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneData])

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
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Nome da Cena'
                    required
                    value={value || ''}
                    onBlur={handleSubmitScene(onSubmitScene)}
                    onChange={onChange}
                    placeholder='Nome da Cena'
                    error={Boolean(errorsScene.name)}
                    {...(errorsScene.name && { helperText: errorsScene.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='eventValue'
                control={controlScene}
                render={({ field: { value } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo de Evento'
                    required
                    value={value || ''}
                    onBlur={handleSubmitScene(onSubmitScene)}
                    onChange={e => handleChangeEventType(e)}
                    error={Boolean(errorsScene.eventValue)}
                    {...(errorsScene.eventValue && { helperText: errorsScene.eventValue.message })}
                  >
                    <MenuItem disabled value=''>
                      <em>Pulsos</em>
                    </MenuItem>
                    <MenuItem value='onePulse'>1 pulso</MenuItem>
                    <MenuItem value='twoPulse'>2 pulsos</MenuItem>
                    <MenuItem value='threePulse'>3 pulsos</MenuItem>
                    <MenuItem value='fourPulse'>4 pulsos</MenuItem>
                    <MenuItem value='fivePulse'>5 pulsos</MenuItem>
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='ledAction'
                control={controlScene}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Led de Ação'
                    required
                    value={value || ''}
                    onBlur={handleSubmitScene(onSubmitScene)}
                    onChange={onChange}
                    error={Boolean(errorsScene.ledAction)}
                    {...(errorsScene.ledAction && { helperText: errorsScene.ledAction.message })}
                  >
                    <MenuItem disabled value=''>
                      <em>selecione</em>
                    </MenuItem>
                    <MenuItem value='ON'>Ligar</MenuItem>
                    <MenuItem value='OFF'>Desligar</MenuItem>
                    <MenuItem value='FOLLOW'>Seguir a Cena</MenuItem>
                    <MenuItem value='NONE'>Sem Efeito</MenuItem>
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
                    disabled={projectDeviceType === 'KEYPAD' ? true : false}
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
      </Card>
      <ActionsConfig />
    </Box>
  )
}

export default Scenes
