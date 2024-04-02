import Link from 'next/link'

import { Grid } from '@mui/material'

import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardOptionHorizontal from 'src/@core/components/card-statistics/card-option-horizontal'

import { NavLink } from 'src/@core/layouts/types'
import navigation from 'src/navigation/vertical'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

const Home = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {navigation().map((item: NavLink, index) => {
          if (item.path === '/home') {
            return null
          }

          return (
            <CanViewNavLink key={index} navLink={item}>
              <Grid item xs={12} sm={6} lg={6}>
                <Link
                  href={item.path as string}
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  <CardOptionHorizontal {...item} />
                </Link>
              </Grid>
            </CanViewNavLink>
          )
        })}
      </Grid>
    </ApexChartWrapper>
  )
}

export default Home
