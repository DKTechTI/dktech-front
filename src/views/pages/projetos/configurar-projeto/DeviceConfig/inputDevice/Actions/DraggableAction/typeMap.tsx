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
      { value: 'TRUE', label: 'Ligado' },
      { value: 'FALSE', label: 'Desligado' }
    ]
  },
  actionValueDimmer: {
    Input: SelectInput,
    options: [
      { value: '0', label: '0' },
      { value: '10', label: '10' },
      { value: '20', label: '20' },
      { value: '30', label: '30' },
      { value: '40', label: '40' },
      { value: '50', label: '50' },
      { value: '60', label: '60' },
      { value: '70', label: '70' },
      { value: '80', label: '80' },
      { value: '90', label: '90' },
      { value: '100', label: '100' },
      { value: 'INCREASE', label: 'Aumentar' },
      { value: 'DECREASE', label: 'Diminuir' },
      { value: 'DIMMER', label: 'Dimerizar' }
    ]
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

function NumberInput({ field, errors, inputProps, startAdornment, handleSubmit, onChange }: any) {
  return (
    <TextField
      {...field}
      size='small'
      type='number'
      error={!!errors[field.name]}
      helperText={errors[field.name]?.message}
      inputProps={inputProps}
      onChange={onChange}
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

function SelectInput({ field, errors, options, handleSubmit, onChange }: any) {
  const selectedValue = field.value !== undefined ? field.value : ''

  return (
    <TextField
      {...field}
      select
      size='small'
      error={!!errors[field.name as ValueType]}
      value={selectedValue}
      onChange={onChange}
      onBlur={handleSubmit}
      sx={{
        minWidth: '140px',
        width: '140px',
        textAlign: 'left'
      }}
    >
      <MenuItem value='' disabled>
        Selecione
      </MenuItem>
      {options &&
        options.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  )
}

export { typeMap }
