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
  if (scene) {
    if (scene?.eventType === 'PULSE') {
      return {
        id: scene.id ?? null,
        deviceId: scene.deviceId,
        projectId: scene.projectId,
        projectDeviceKeyId: scene.projectDeviceKeyId,
        name: scene.name,
        eventType: scene.eventType,
        sceneType: scene.sceneType,
        pulseQuantity: scene.pulseQuantity,
        isRepeatEvent: scene.isRepeatEvent
      }
    }

    if (scene?.eventType === 'TIME_PRESSED') {
      return {
        id: scene.id ?? null,
        deviceId: scene.deviceId,
        projectId: scene.projectId,
        projectDeviceKeyId: scene.projectDeviceKeyId,
        name: scene.name,
        eventType: scene.eventType,
        sceneType: scene.sceneType,
        timePressed: scene.timePressed,
        isRepeatEvent: scene.isRepeatEvent
      }
    }

    return {
      id: scene.id ?? null,
      deviceId: scene.deviceId,
      projectId: scene.projectId,
      projectDeviceKeyId: scene.projectDeviceKeyId,
      name: scene.name,
      eventType: scene.eventType,
      sceneType: scene.sceneType,
      isRepeatEvent: scene.isRepeatEvent
    }
  }
}

export { checkEventTypeValue, checkSceneTypeValue, formatSceneObject }
