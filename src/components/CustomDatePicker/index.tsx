import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import ptBR from 'date-fns/locale/pt-BR'

import CustomInput from './PickersCustomInput'

type DateType = Date | null | undefined

interface CustomDatePickerProps {
  label?: string
  placeholderText?: string
  value?: DateType
  onChange?: (date: Date) => void
}

const CustomDatePicker = ({ label, placeholderText, value, onChange }: CustomDatePickerProps) => {
  return (
    <DatePicker
      selected={value}
      locale={ptBR}
      onChange={(date: Date) => onChange && onChange(date)}
      popperPlacement='bottom-end'
      placeholderText={placeholderText || 'Selecione uma data'}
      customInput={<CustomInput label={label} fullWidth />}
    />
  )
}

export default CustomDatePicker
