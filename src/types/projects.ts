export interface ProjectProps {
  _id: string
  ressellerId: string
  clientId: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProjectDataProps {
  page: number
  per_page: number
  pre_page: number | null
  next_page: number
  total: number
  total_pages: number
  data: ProjectProps[]
}
