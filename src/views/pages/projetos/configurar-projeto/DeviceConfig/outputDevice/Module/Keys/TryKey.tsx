import { SyntheticEvent } from 'react'

import { Box, Button, Grid, useMediaQuery, Checkbox, FormControlLabel, MenuItem } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { checkInitialValue } from 'src/utils/project'

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  order: yup.string().required('Order é obrigatório'),
  initialValue: yup.string().required('Valor Inicial é obrigatório'),
  voiceActivation: yup.string().required('Ativação por Voz é obrigatório')
})

interface FormData {
  name: string
  order: string
  initialValue: string
  voiceActivation: string
}

interface TryKeyProps {
  keyData: any
  operationType: string
}

const TryKey = ({ keyData, operationType }: TryKeyProps) => {
  const matches = useMediaQuery('(min-width:1534px)')

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    values: keyData as FormData,
    resolver: yupResolver(schema)
  })

  const handleSetVoiceActivation = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement

    setValue('voiceActivation', String(checked))
  }

  const handleCheckInitialValue = (operationType: string) => {
    const deviceInitialValue = checkInitialValue(operationType)

    return deviceInitialValue
  }

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Grid container gap={4} alignItems={'end'} justifyContent={'space-around'}>
      <Grid item xs={12} sm={5} md={2} lg={2} xl={2}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Nome'
              required
              placeholder='Nome'
              error={Boolean(errors.name)}
              {...(errors.name && { helperText: errors.name.message })}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={2} lg={3} xl={2}>
        <Controller
          name='order'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Order'
              required
              placeholder='Order'
              error={Boolean(errors.order)}
              {...(errors.order && { helperText: errors.order.message })}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={2} lg={3} xl={2}>
        <Controller
          name='initialValue'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              select
              fullWidth
              label='Valor Inicial'
              required
              error={Boolean(errors.initialValue)}
              {...(errors.initialValue && { helperText: errors.initialValue.message })}
            >
              <MenuItem value='' disabled>
                <em>Selecione</em>
              </MenuItem>
              {handleCheckInitialValue(operationType).map((initialValue: any, index: number) => {
                return (
                  <MenuItem key={index} value={initialValue?.value || ''}>
                    {initialValue?.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={2} lg={3} xl={2}>
        <Controller
          name='voiceActivation'
          control={control}
          render={({ field: { value, onBlur } }) => (
            <FormControlLabel
              onChange={(e: SyntheticEvent) => handleSetVoiceActivation(e)}
              checked={value === 'true'}
              onBlur={onBlur}
              control={<Checkbox />}
              label='Ativação por voz'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={2} lg={12} xl={2}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            fullWidth={matches}
            variant='contained'
            color='primary'
            sx={{ minWidth: '138px' }}
            startIcon={<IconifyIcon icon='tabler:wifi' />}
            onClick={handleSubmit(onSubmit)}
          >
            Testar
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default TryKey
