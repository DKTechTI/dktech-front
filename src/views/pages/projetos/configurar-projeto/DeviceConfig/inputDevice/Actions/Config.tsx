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

  const { keyId } = useDeviceKeys()
  const { actions, projectSceneId, setActions } = useActionsDnD()

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

  const onSubmit = (data: formData) => {
    const lastItemIsDelay = handleCheckLastAction(data, actions)

    if (lastItemIsDelay) return toast.error('Não é possível adicionar uma ação de delay após outra ação de delay!')

    api
      .post('/projectSceneActions', data)
      .then(response => {
        if (response.status === 201) {
          const newData = {
            ...response.data.data,
            name: 'DELAY'
          }
          setActions((prevState: any) => [...prevState, newData])
        }
      })
      .catch(() => toast.error('Erro ao adicionar ação, tente novamente mais tarde!'))
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
              <Actions actions={actions} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default Config
