import { useEffect } from 'react'

import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { Grid, LinearProgress } from '@mui/material'

import ClientProfile from 'src/views/pages/clientes/account'
import TabsAccount from 'src/views/pages/clientes/account/tabsAccount'

import useGetDataApi from 'src/hooks/useGetDataApi'

import themeConfig from 'src/configs/themeConfig'

export default function Client() {
  const router = useRouter()

  const { id } = router.query

  const {
    data: client,
    loading,
    error,
    refresh,
    setRefresh
  } = useGetDataApi<any>({ url: `/clients/${id}`, callInit: router.isReady })

  useEffect(() => {
    if (!loading) error && router.push('/404')
  }, [loading, error, router])

  if (loading) return <LinearProgress />

  if (client) {
    return (
      <>
        <NextSeo
          title={`${themeConfig.templateName} - ${client.data.name}`}
          description={`${themeConfig.templateName} - ${client.data.name}`}
        />
        <Grid container spacing={6}>
          <Grid item xs={12} xl={4}>
            <ClientProfile data={client.data} refresh={refresh} setRefresh={setRefresh} />
          </Grid>
          <Grid item xs={12} xl={8}>
            <TabsAccount data={client.data} />
          </Grid>
        </Grid>
      </>
    )
  }
}

Client.acl = {
  action: 'read',
  subject: 'client'
}
