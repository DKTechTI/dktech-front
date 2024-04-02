import { useEffect } from 'react'
import { useRouter } from 'next/router'

import useGetDataApi from 'src/hooks/useGetDataApi'

import DeviceInfo from 'src/views/pages/dispositivos/deviceInfo'

import { LinearProgress } from '@mui/material'

export default function Device() {
  const router = useRouter()

  const { id } = router.query

  const { data, loading, error, refresh, setRefresh } = useGetDataApi<any>({
    url: `/devices/${id}`,
    callInit: router.isReady
  })

  useEffect(() => {
    if (!loading) error && router.push('/404')
  }, [error, loading, router])

  if (loading) return <LinearProgress />

  if (data) return <DeviceInfo data={data.data} refresh={refresh} setRefresh={setRefresh} />
}

Device.acl = {
  action: 'manage',
  subject: 'admin'
}
