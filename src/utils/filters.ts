import { format } from 'date-fns'

const formatDateFilter = (date: Date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null
  }

  return format(date, 'yyyy-MM-dd')
}

export { formatDateFilter }
