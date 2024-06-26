import { useState } from 'react'

import { useRouter } from 'next/router'

import { Button, Card, CardContent, Grid, InputAdornment, Typography } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import CustomTextField from 'src/@core/components/mui/text-field'
import Create from './Create'
import Actions from '.'

import { useActionsDnD } from 'src/hooks/useActionsDnD'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import { api } from 'src/services/api'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import toast from 'react-hot-toast'
import useErrorHandling from 'src/hooks/useErrorHandling'
import projectSceneActionsErrors from 'src/errors/projectSceneActionsErrors'

const schema = yup.object().shape({
  actionValueDelay: yup
    .number()
    .typeError('Valor deve ser um número')
    .required('Delay obrigatório')
    .min(0.1, 'Delay deve ser maior que 0.1')
})

interface formData {
  projectId: string
  projectSceneId: string
  projectDeviceKeyId: string
  type: string
  actionProjectDeviceKeyId: string
  actionValueDelay: number
}

const Config = () => {
  const router = useRouter()

  const { id: projectId } = router.query

  const { keyId, deviceKeys } = useDeviceKeys()
  const { handleErrorResponse } = useErrorHandling()
  const { actions, projectSceneId, setRefreshActions, refreshActions } = useActionsDnD()

  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: {
      projectId: projectId,
      projectSceneId: projectSceneId,
      projectDeviceKeyId: keyId,
      type: 'DELAY',
      actionValueDelay: 0.1
    } as formData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleCheckLastAction = (data: any, actions: any) => {
    if (data && actions.length !== 0) {
      const lastAction = actions[actions.length - 1]

      return lastAction.type === 'DELAY' ? true : false
    }
  }

  const handleGetCentralId = (keyId: string) => {
    const centralId = deviceKeys.find((key: any) => key._id === keyId)?.centralId

    return centralId
  }

  const onSubmit = (data: formData) => {
    const lastItemIsDelay = handleCheckLastAction(data, actions)

    if (lastItemIsDelay) return toast.error('Não é possível adicionar uma ação de delay após outra ação de delay.')

    const centralId = handleGetCentralId(data.projectDeviceKeyId)

    if (!centralId) return toast.error('Erro ao buscar centralId, tente novamente mais tarde.')

    const dataToSend = {
      ...data,
      centralId: centralId
    }

    api
      .post('/projectSceneActions', dataToSend)
      .then(response => {
        if (response.status === 201) {
          setRefreshActions(!refreshActions)
          toast.success('Ação adicionada com sucesso!')
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: projectSceneActionsErrors,
          defaultErrorMessage: 'Erro ao adicionar ação, tente novamente mais tarde.'
        })
      })
  }

  return (
    <>
      <Create open={addDialogOpen} handleClose={() => setAddDialogOpen(false)} />

      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} sx={{ paddingTop: '0 !important' }}>
              <Typography variant='h6'>Ações</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' endIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
                Adicionar Ação
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='actionValueDelay'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Delay'
                    type='number'
                    inputProps={{ step: '0.1', min: '0.1' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Button variant='contained' size='small' onClick={handleSubmit(onSubmit)}>
                            Adicionar
                          </Button>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(errors.actionValueDelay)}
                    {...(errors.actionValueDelay && { helperText: errors.actionValueDelay.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              {actions && <Actions actions={actions} />}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default Config
