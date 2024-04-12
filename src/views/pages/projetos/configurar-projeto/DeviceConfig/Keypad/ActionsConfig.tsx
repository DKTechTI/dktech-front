import { useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Grid, InputAdornment, Typography } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import CustomTextField from 'src/@core/components/mui/text-field'

import ActionsList from './ActionsList'
import ActionAddDialog from './ActionsAddDialog'

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

// const schemaScene = yup.object().shape({
//   name: yup.string().required('Nome da tecla obrigatório'),
//   eventValue: yup.string().required('Tipo da tecla obrigatório'),
//   sceneType: yup.string().required('Tipo da cena obrigatório')
// })

// interface FormDataActions {
//   id: string | null
//   projectId: string
//   deviceId: string
//   projectDeviceKeyId: string
//   sceneType: string
//   eventType: string
//   eventValue: string
//   pulseQuantity?: number
//   timePressed?: number
//   isRepeatEvent: boolean
//   name: string
// }

const ActionsConfig = () => {
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false)

  return (
    <>
      <ActionAddDialog open={addDialogOpen} handleClose={() => setAddDialogOpen(false)} />

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
              <CustomTextField
                type='number'
                fullWidth
                label='Delay'
                placeholder='Delay'
                inputProps={{ step: '0.1', min: '0.1' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Button variant='contained' size='small'>
                        Adicionar
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <ActionsList data={acoes} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'end' }}>
            <Button variant='contained'>Salvar</Button>
          </Box>
        </CardActions>
      </Card>
    </>
  )
}

export default ActionsConfig
