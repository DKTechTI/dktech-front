export interface ClientProps {
  _id: string
  resellerId: string
  name: string
  phone: string
  cellphone: string
  cep: string
  address: string
  neighborhood: string
  city: string
  state: string
  number: number
  complement: string
  createdAt: string
  updatedAt: string
  status: 'ACTIVE' | 'INACTIVE'
}

export interface ClientDataProps {
  page: number
  per_page: number
  pre_page: number | null
  next_page: number
  total: number
  total_pages: number
  data: ClientProps[]
}
