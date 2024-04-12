import { Grid, LinearProgress } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import useGetDataApi from 'src/hooks/useGetDataApi'
import { ResaleProps } from 'src/types/resales'
import { UserProps } from 'src/types/users'
import MyAccountContent from 'src/views/pages/minha-conta'
import TabsAccount from 'src/views/pages/minha-conta/tabsAccount'

interface UseGetDataApiProps {
  data: UserProps | ResaleProps
}

const MyAccount = () => {
  const { user } = useAuth()

  const { data, loading, refresh, setRefresh } = useGetDataApi<UseGetDataApiProps>({ url: `/users/${user?.id}` })

  if (loading) {
    return <LinearProgress />
  }

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} xl={4}>
          <MyAccountContent data={data.data} refresh={refresh} setRefresh={setRefresh} />
        </Grid>
        <Grid item xs={12} xl={8}>
          <TabsAccount data={data.data} />
        </Grid>
      </Grid>
    )
  }
}

export default MyAccount
