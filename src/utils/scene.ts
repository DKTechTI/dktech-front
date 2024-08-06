const checkEventTypeValue = (eventType: string, value: number) => {
  const pulseObj: { [key: number]: string } = {
    1: 'onePulse',
    2: 'twoPulse',
    3: 'threePulse',
    4: 'fourPulse',
    5: 'fivePulse'
  }

  const pressTimeObj: { [key: number]: string } = {
    2: 'twoTimePressed',
    3: 'threeTimePressed',
    4: 'fourTimePressed',
    5: 'fiveTimePressed'
  }

  if (eventType && value) {
    if (eventType === 'PULSE' && pulseObj[value as number]) return pulseObj[value]

    if (eventType === 'TIME_PRESSED' && pressTimeObj[value]) return pressTimeObj[value]
  }

  return 'repeat'
}

const checkSceneTypeValue = (sceneType: string) => {
  switch (sceneType) {
    case 'LOAD':
      return 'loadingScene'
    case 'TOGGLE':
      return 'toggleScene'
    case 'ON/OFF':
      return 'onOffScene'
    default:
      return ''
  }
}
const formatSceneObject = (scene: any) => {
  if (!scene) return null

  const sceneObj: any = {
    deviceId: scene.deviceId,
    projectId: scene.projectId,
    projectDeviceKeyId: scene.projectDeviceKeyId,
    name: scene.name,
    eventType: scene.eventType,
    sceneType: scene.sceneType,
    isRepeatEvent: scene.isRepeatEvent,
    ledAction: scene.ledAction
  }

  if (scene.sceneId) {
    sceneObj.sceneId = scene.sceneId
  }

  if (scene.eventType === 'PULSE') {
    return {
      ...sceneObj,
      pulseQuantity: scene.pulseQuantity
    }
  }

  if (scene.eventType === 'TIME_PRESSED') {
    return {
      ...sceneObj,
      timePressed: scene.timePressed
    }
  }

  return sceneObj
}

const formatEventValueForRequest = (eventValue: any) => {
  const eventValueObj: { [key: string]: number | string } = {
    onePulse: 1,
    twoPulse: 2,
    threePulse: 3,
    fourPulse: 4,
    fivePulse: 5,
    twoTimePressed: 2,
    threeTimePressed: 3,
    fourTimePressed: 4,
    fiveTimePressed: 5,
    repeat: ''
  }

  if (eventValue && eventValueObj[eventValue]) return eventValueObj[eventValue]
}

const formatEventTypeForRequest = (eventType: string) => {
  const eventTypeObj: { [key: string]: string } = {
    onePulse: 'PULSE',
    twoPulse: 'PULSE',
    threePulse: 'PULSE',
    fourPulse: 'PULSE',
    fivePulse: 'PULSE',
    twoTimePressed: 'TIME_PRESSED',
    threeTimePressed: 'TIME_PRESSED',
    fourTimePressed: 'TIME_PRESSED',
    fiveTimePressed: 'TIME_PRESSED',
    repeat: 'REPEAT'
  }

  if (eventType && eventTypeObj[eventType]) return eventTypeObj[eventType]
}

const eventTypeOptions = [
  {
    value: '',
    label: 'Pulsos',
    disabled: true
  },
  {
    value: 'onePulse',
    label: '1 pulso',
    disabled: false
  },
  {
    value: 'twoPulse',
    label: '2 pulsos',
    disabled: false
  },
  {
    value: 'threePulse',
    label: '3 pulsos',
    disabled: false
  },
  {
    value: 'fourPulse',
    label: '4 pulsos',
    disabled: false
  },
  {
    value: 'fivePulse',
    label: '5 pulsos',
    disabled: false
  },
  {
    value: '',
    label: 'Tempo Pressionado',
    disabled: true
  },
  {
    value: 'twoTimePressed',
    label: '2 segundos',
    disabled: false
  },
  {
    value: 'threeTimePressed',
    label: '3 segundos',
    disabled: false
  },
  {
    value: 'fourTimePressed',
    label: '4 segundos',
    disabled: false
  },
  {
    value: 'fiveTimePressed',
    label: '5 segundos',
    disabled: false
  },
  {
    value: '',
    label: 'Repetição',
    disabled: true
  },
  {
    value: 'repeat',
    label: 'Manter pressionado',
    disabled: false
  }
]

export {
  checkEventTypeValue,
  checkSceneTypeValue,
  formatSceneObject,
  formatEventValueForRequest,
  formatEventTypeForRequest,
  eventTypeOptions
}
