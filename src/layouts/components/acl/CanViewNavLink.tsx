// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(AbilityContext)
  const auth = useAuth()

  if (navLink && navLink.auth === false) {
    return <>{children}</>
  }

  if (auth.user && auth.user.role === navLink?.subject && ability.can(navLink?.action, navLink?.subject)) {
    return <>{children}</>
  }

  if (auth.user && Array.isArray(navLink?.subject) && navLink?.subject.includes(auth.user?.role as any)) {
    return <>{children}</>
  }

  return null
}

export default CanViewNavLink
