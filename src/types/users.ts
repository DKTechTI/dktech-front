export interface UserProps {
  _id: string
  name: string
  email: string
  phone: string
  createdAt?: string
  status: 'active' | 'inactive'
  type: 'ADMIN'
}

export interface UserDataProps {
  page: number
  per_page: number
  pre_page: number | null
  next_page: number
  total: number
  total_pages: number
  data: UserProps[]
}
