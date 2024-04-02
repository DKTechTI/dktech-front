// ** React Imports
import { TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

const PickersComponent = forwardRef((props: TextFieldProps & { readOnly?: boolean }, ref) => {
  // ** Props
  const { label, readOnly } = props

  return (
    <CustomTextField
      {...props}
      inputRef={ref}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

export default PickersComponent
