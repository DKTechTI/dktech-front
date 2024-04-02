// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      action: 'read',
      auth: true,
      subject: ['admin', 'client'],
      icon: 'tabler:smart-home'
    },
    {
      title: 'Usuários',
      subtitle: 'ver Usuários',
      path: '/usuarios',
      action: 'create',
      auth: true,
      subject: 'admin',
      icon: 'tabler:users',
      avatarColor: 'primary'
    },
    {
      title: 'Revendas',
      subtitle: 'ver Revendas',
      path: '/revendas',
      auth: true,
      action: 'create',
      subject: 'admin',
      icon: 'tabler:garden-cart',
      avatarColor: 'success'
    },
    {
      title: 'Dispositivos',
      subtitle: 'ver Dispositivos',
      path: '/dispositivos',
      auth: true,
      action: 'create',
      subject: 'admin',
      icon: 'tabler:devices',
      avatarColor: 'warning'
    },
    {
      title: 'Clientes',
      subtitle: 'ver Clientes',
      action: 'read',
      auth: true,
      subject: 'client',
      path: '/clientes',
      icon: 'tabler:users',
      avatarColor: 'primary'
    },
    {
      title: 'Projetos',
      subtitle: 'ver Projetos',
      action: 'read',
      auth: true,
      subject: 'client',
      path: '/projetos',
      icon: 'tabler:clipboard-list',
      avatarColor: 'success'
    },
    {
      title: 'Monitoramento',
      subtitle: 'ver Monitoramento',
      path: '/monitoramento',
      action: 'read',
      auth: true,
      subject: 'client',
      icon: 'tabler:eye-pin',
      avatarColor: 'warning'
    },
    {
      title: 'Minha Conta',
      path: '/minha-conta',
      action: 'read',
      auth: true,
      subject: ['admin', 'client'],
      icon: 'tabler:user-check',
      avatarColor: 'info'
    }
  ]
}

export default navigation
