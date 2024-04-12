export interface ResaleProps {
  _id: string
  name: string
  email: string
  password?: string
  companyName: string
  stateRegistration: string
  municipalRegistration: string
  phone: string
  cellphone: string
  documentHash?: string
  documentType: 'CPF' | 'CNPJ' | 'OTHER'
  documentNumber: string
  cep: string
  address: string
  neighborhood: string
  city: string
  state: string
  number: string
  complement: string
  referenceCarrier: string
  createdAt: string
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
  type: 'CLIENT'
  projectsCount: number
}

export interface ResaleDataProps {
  page: number
  per_page: number
  pre_page: number | null
  next_page: number
  total: number
  total_pages: number
  data: ResaleProps[]
}
