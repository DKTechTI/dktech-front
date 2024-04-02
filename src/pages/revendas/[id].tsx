import { useEffect } from 'react'
import { Grid, LinearProgress } from '@mui/material'

import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import useGetDataApi from 'src/hooks/useGetDataApi'

import UserResale from 'src/views/pages/revendas/account'
import TabsResaleAccount from 'src/views/pages/revendas/account/tabsResaleAccount'

import themeConfig from 'src/configs/themeConfig'

export default function Resale() {
  const router = useRouter()

  const { id } = router.query

  const {
    data: resale,
    loading,
    error,
    refresh,
    setRefresh
  } = useGetDataApi<any>({
    url: `/users/${id}`,
    callInit: router.isReady
  })

  useEffect(() => {
    if (!loading) error && router.push('/404')
  }, [error, loading, router])

  if (loading) return <LinearProgress />

  if (resale) {
    return (
      <>
        <NextSeo
          title={`${themeConfig.templateName} - ${resale.data.name}`}
          description={`${themeConfig.templateName} - ${resale.data.name}`}
        />
        <Grid container spacing={6}>
          <Grid item xs={12} xl={4}>
            <UserResale data={resale.data} refresh={refresh} setRefresh={setRefresh} />
          </Grid>
          <Grid item xs={12} xl={8}>
            <TabsResaleAccount data={resale.data} />
          </Grid>
        </Grid>
      </>
    )
  }
}

Resale.acl = {
  action: 'manage',
  subject: 'admin'
}
