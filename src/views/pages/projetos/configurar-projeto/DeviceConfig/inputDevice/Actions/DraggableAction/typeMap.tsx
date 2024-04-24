import { TextField, MenuItem, InputAdornment } from '@mui/material'

export type ValueType = 'actionValueReles' | 'actionValueDimmer' | 'actionValueDelay' | 'actionValueEngine'

interface TypeMapEntry {
  Input: React.ElementType
  handleSubmit?: any
  inputProps?: { step: string; min: string; max: string }
  options?: { value: string; label: string }[]
  startAdornment?: React.ReactNode
}

const typeMap: Record<ValueType, TypeMapEntry> = {
  actionValueReles: {
    Input: SelectInput,
    options: [
      { value: 'true', label: 'Ligado' },
      { value: 'false', label: 'Desligado' }
    ]
  },
  actionValueDimmer: {
    Input: NumberInput,
    inputProps: { step: '10', min: '0', max: '100' },
    startAdornment: <InputAdornment position='start'>%</InputAdornment>
  },
  actionValueDelay: {
    Input: NumberInput,
    inputProps: { step: '0.1', min: '0.1', max: '60' },
    startAdornment: <InputAdornment position='start'>seg:</InputAdornment>
  },
  actionValueEngine: {
    Input: SelectInput,
    options: [
      { value: 'OPEN', label: 'Abrir' },
      { value: 'CLOSE', label: 'Fechar' },
      { value: 'STOP', label: 'Parar' },
      { value: 'OPEN/STOP', label: 'Abrir/Parar' },
      { value: 'CLOSE/STOP', label: 'Fechar/Parar' },
      { value: 'OPEN/STOP/CLOSE/STOP', label: 'Abrir/Parar/Fechar/Parar' }
    ]
  }
}

function NumberInput({ field, errors, inputProps, startAdornment, handleSubmit }: any) {
  return (
    <TextField
      {...field}
      size='small'
      type='number'
      error={!!errors[field.name]}
      helperText={errors[field.name]?.message}
      inputProps={inputProps}
      InputProps={{
        startAdornment: startAdornment
      }}
      onBlur={handleSubmit}
      sx={{
        minWidth: '140px',
        width: '140px'
      }}
    />
  )
}

function SelectInput({ field, errors, options, handleSubmit }: any) {
  return (
    <TextField
      {...field}
      select
      size='small'
      error={!!errors[field.name as ValueType]}
      defaultValue={field?.value || ''}
      onChange={e => field?.onChange(e.target.value)}
      onBlur={handleSubmit}
      sx={{
        minWidth: '140px',
        width: '140px',
        textAlign: 'left'
      }}
    >
      {options.map((option: any) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export { typeMap }
