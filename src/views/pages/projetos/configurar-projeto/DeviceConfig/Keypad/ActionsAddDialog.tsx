import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  DialogActions,
  Button,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  useTheme,
  ListItemButton
} from '@mui/material'

import toast from 'react-hot-toast'

import IconifyIcon from 'src/@core/components/icon'

import * as yup from 'yup'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useProjectMenu } from 'src/hooks/useProjectMenu'
import { useActionsDnD } from 'src/hooks/useActionsDnD'
import { useDeviceKeys } from 'src/hooks/useDeviceKeys'

import { api } from 'src/services/api'

import { verifyObjectErrorsIsEmpty } from 'src/utils/verifyErrors'

const schema = yup.object().shape({
  outputs: yup
    .array()
    .of(
      yup.object().shape({
        projectId: yup.string().required('Projeto obrigatório'),
        projectSceneId: yup.string().required('Cena obrigatória'),
        projectDeviceKeyId: yup.string().required('Chave obrigatória'),
        actionProjectDeviceId: yup.string().required('Dispositivo obrigatório'),
        boardId: yup.string().required('Placa obrigatória'),
        type: yup.string().required('Tipo obrigatório'),
        actionValueReles: yup.boolean().required('Valor obrigatório')
      })
    )
    .min(1, 'Pelo menos uma saída deve ser adicionada')
})

const outputs: any[] = []

interface FormData {
  outputs: {
    projectId: string
    projectSceneId: string
    projectDeviceKeyId: string
    actionProjectDeviceId: string
    boardId: string
    type: string
    actionValueReles?: boolean
  }[]
}

interface EditProfileProps {
  open: boolean
  handleClose: () => void
}

const ActionAddDialog = ({ open, handleClose }: EditProfileProps) => {
  const theme = useTheme()

  const router = useRouter()

  const { id } = router.query

  const { menu } = useProjectMenu()
  const { keyId } = useDeviceKeys()
  const { projectSceneId } = useActionsDnD()

  const [environments, setEnvironments] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    values: {
      outputs: outputs
    } as FormData,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'outputs'
  })

  const handleSelectOutput = (environmentId: string, deviceName: string) => {
    const environmentSelected: any = environments.filter(environment => environment.environmentId === environmentId)

    const outputSelected: any = environmentSelected[0].outputs.filter((output: any) => output.deviceName === deviceName)

    if (outputSelected.length > 0) {
      const output: any = outputSelected[0]

      if (!projectSceneId) {
        handleClose()
        toast.error('Selecione uma cena antes de adicionar uma ação')

        return
      }

      append({
        projectId: id as string,
        projectSceneId: projectSceneId,
        projectDeviceKeyId: keyId,
        actionProjectDeviceId: output.projectDeviceId,
        boardId: output.deviceName,
        type: 'EXTERNAL',
        actionValueReles: true
      })
    }
  }

  const onSubmit = (formData: FormData) => {
    const createActions = async (data: any) => {
      return api.post('/projectSceneActions', data)
    }

    const promisses = formData.outputs.map(output => createActions(output))

    Promise.all(promisses)
      .then(() => {
        handleClose()
        toast.success('Ações adicionadas com sucesso!')
      })
      .catch(() => {
        handleClose()
        toast.error('Erro ao adicionar ações, tente novamente mais tarde')
      })
  }

  useEffect(() => {
    reset()
  }, [reset, open])

  useEffect(() => {
    if (menu) setEnvironments(menu.environments)
  }, [menu])

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 1000 } }}>
      <DialogTitle
        id='user-view-edit'
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        Adicionar Ação
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' sx={{ textAlign: 'center', mb: 7 }}>
          Selecione uma saída para gerar a ação
        </DialogContentText>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 }
              }}
              subheader={<li />}
            >
              {environments.map(environment => (
                <li key={environment.environmentId}>
                  <ul>
                    <ListSubheader
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      {environment.name}
                    </ListSubheader>
                    {(!environment.outputs || environment.outputs.length === 0) && (
                      <ListItem
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <ListItemText primary='Nenhuma opção' />
                      </ListItem>
                    )}
                    {environment.outputs.map((output: any) => (
                      <ListItemButton
                        key={output.projectDeviceId}
                        onClick={() => handleSelectOutput(environment.environmentId, output.deviceName)}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <ListItemText primary={output.deviceName} />
                      </ListItemButton>
                    ))}
                  </ul>
                </li>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <List
              sx={{
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300
              }}
              subheader={<li />}
            >
              <ListSubheader>Saídas Escolhidas</ListSubheader>
              {(!fields || fields.length === 0) && (
                <ListItem
                  sx={{
                    borderBottom: `1px solid ${
                      verifyObjectErrorsIsEmpty(errors) ? theme.palette.divider : theme.palette.error.main
                    }`
                  }}
                >
                  <ListItemText
                    primary={
                      verifyObjectErrorsIsEmpty(errors)
                        ? 'Nenhuma saída escolhida'
                        : 'É preciso escolher ao menos uma saída!'
                    }
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: verifyObjectErrorsIsEmpty(errors) ? theme.palette.primary : theme.palette.error.main
                      } as unknown as string
                    }}
                  />
                </ListItem>
              )}
              {fields.map((item, index) => (
                <ListItem
                  key={item.id}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <ListItemText primary={item.boardId} />
                  <IconifyIcon
                    fontSize='1.75rem'
                    icon='tabler:trash'
                    onClick={() => remove(index)}
                    style={{
                      cursor: 'pointer'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActionAddDialog
