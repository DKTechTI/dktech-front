import { AxiosError } from 'axios'
import { useState, useEffect, useRef } from 'react'

import { api } from 'src/services/api'

interface GetDataApiProps {
  url: string
  params?: Record<string, any>
  callInit?: boolean
}

const useGetDataApi = <T,>({ url, params, callInit = true }: GetDataApiProps) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosError | null>(null)
  const [refresh, setRefresh] = useState(false)

  const paramsRef = useRef(params)

  useEffect(() => {
    if (callInit) {
      if (JSON.stringify(paramsRef.current) !== JSON.stringify(params)) {
        paramsRef.current = params

        setLoading(true)

        api
          .get(url, { params: paramsRef.current })
          .then(response => {
            setData(response.data)
          })
          .catch(error => {
            setError(error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [url, params, refresh, callInit])

  useEffect(() => {
    if (callInit) {
      setLoading(true)

      api
        .get(url, { params: paramsRef.current })
        .then(response => {
          setData(response.data)
        })
        .catch(error => {
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [url, refresh, callInit])

  return { data, loading, error, setRefresh, refresh }
}

export default useGetDataApi
