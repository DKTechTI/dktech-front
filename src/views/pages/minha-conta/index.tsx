import { useState } from 'react'
import { Grid, Card, CardContent, Typography, Divider, CardActions, Button, Box } from '@mui/material'

import DialogAlert from 'src/@core/components/dialogs/dialog-alert'
import Avatar from 'src/@core/components/mui/avatar'
import Chip from 'src/@core/components/mui/chip'

import EditProfile from './editAccount'
import EditAdminAccount from './editAdminAccount'

import { formatDocumentNumber } from 'src/utils/formatDocumentNumber'
import { getInitials } from 'src/@core/utils/get-initials'

import { ThemeColor } from 'src/@core/layouts/types'
import { ResaleProps } from 'src/types/resales'
import { UserProps } from 'src/types/users'
import { verifyUserStatus, verifyUserType } from 'src/@core/utils/user'
import { api } from 'src/services/api'
import toast from 'react-hot-toast'
import { delay } from 'src/utils/delay'
import { useRouter } from 'next/router'
import verifyDataValue from 'src/utils/verifyDataValue'

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  admin: 'info',
  client: 'success'
}

const statusColors: ColorsType = {
  active: 'success',
  inactive: 'secondary',
  blocked: 'error',
  pending: 'warning'
}

interface UserProfileProps {
  data: UserProps | ResaleProps
  refresh: boolean
  setRefresh: (value: boolean) => void
}

const MyAccount = ({ data, refresh, setRefresh }: UserProfileProps) => {
  const router = useRouter()

  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const handleConfirmDeleteProfile = (id: string) => {
    api
      .delete(`/users/${id}`)
      .then(response => {
        if (response.status === 200) {
          setDeleteDialogOpen(false)
          toast.success('Conta deletada com sucesso!')
          delay(2000).then(() => {
            router.reload()
          })
        }
      })
      .catch(() => {
        setDeleteDialogOpen(false)
        toast.error('Erro ao deletar sua conta, tente novamente mais tarde')
      })
  }

  if (data.type === 'ADMIN') {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{ padding: '40px 40px 20px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            >
              <Avatar
                skin='light'
                variant='rounded'
                color={roleColors[data.type] as ThemeColor}
                sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
              >
                {getInitials(data.name)}
              </Avatar>
              <Typography variant='h4' sx={{ mb: 3 }}>
                {data.name}
              </Typography>
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />

            <CardContent
              sx={{ padding: { xs: '20px 20px 10px !important', xl: '20px 40px 10px !important' }, width: '100%' }}
            >
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Detalhes
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Nome:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>@ {data.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                  <Chip
                    rounded
                    skin='light'
                    size='small'
                    label={verifyUserStatus(String(data.status).toLocaleLowerCase())}
                    color={statusColors[String(data.status).toLocaleLowerCase()]}
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Box>
            </CardContent>

            <CardContent
              sx={{ padding: { xs: '0 20px 20px !important', xl: '0 40px 20px !important' }, width: '100%' }}
            >
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Contato
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>E-mail:</Typography>
                  <Typography sx={{ ml: 3, color: 'text.secondary' }}>{data.email}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Editar
              </Button>
              <Button color='error' variant='tonal' onClick={() => setDeleteDialogOpen(true)}>
                Deletar
              </Button>
            </CardActions>

            <EditAdminAccount
              data={data}
              handleEditClose={handleEditClose}
              openEdit={openEdit}
              refresh={refresh}
              setRefresh={setRefresh}
            />

            <DialogAlert
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              question={'Você tem certeza que deseja deletar sua conta?'}
              description={'Esta ação não poderá ser desfeita.'}
              handleConfirmDelete={() => handleConfirmDeleteProfile(data._id)}
            />
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent
            sx={{ padding: '40px 40px 20px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}
          >
            <Avatar
              skin='light'
              variant='rounded'
              color={roleColors[data.type] as ThemeColor}
              sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
            >
              {getInitials(data.name)}
            </Avatar>
            <Typography variant='h4' sx={{ mb: 3 }}>
              {data.name}
            </Typography>
            <Chip
              rounded
              skin='light'
              size='small'
              label={verifyUserType(String(data.type).toLocaleLowerCase())}
              color={roleColors[String(data.type).toLocaleLowerCase()]}
              sx={{ textTransform: 'capitalize', mb: 4 }}
            />
          </CardContent>

          <Divider sx={{ my: '0 !important', mx: 6 }} />

          <CardContent
            sx={{ padding: { xs: '20px 20px 10px !important', xl: '20px 40px 10px !important' }, width: '100%' }}
          >
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              Detalhes da minha conta
            </Typography>
            <Box sx={{ pt: 4 }}>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Nome:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>@ {data.name}</Typography>
              </Box>

              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Documento:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {formatDocumentNumber(data?.documentNumber, data.documentType)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                <Chip
                  rounded
                  skin='light'
                  size='small'
                  label={verifyUserStatus(String(data.status).toLocaleLowerCase())}
                  color={statusColors[String(data.status).toLocaleLowerCase()]}
                  sx={{
                    textTransform: 'capitalize'
                  }}
                />
              </Box>
            </Box>
          </CardContent>

          <CardContent sx={{ padding: { xs: '0 20px 20px !important', xl: '0 40px 20px !important' }, width: '100%' }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              Contato
            </Typography>
            <Box sx={{ pt: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email pessoal:</Typography>
                <Typography sx={{ ml: 3, color: 'text.secondary' }}>{data.email}</Typography>
              </Box>

              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Telefone:</Typography>
                <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {verifyDataValue(data.cellphone)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Telefone fixo:</Typography>
                <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {verifyDataValue(data.phone)}
                </Typography>
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button color='error' variant='tonal' onClick={() => setDeleteDialogOpen(true)}>
              Deletar
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              Editar
            </Button>
          </CardActions>

          <EditProfile
            data={data}
            handleEditClose={handleEditClose}
            openEdit={openEdit}
            refresh={refresh}
            setRefresh={setRefresh}
          />

          <DialogAlert
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            question={'Você tem certeza que deseja deletar sua conta?'}
            description={'Esta ação não poderá ser desfeita.'}
            handleConfirmDelete={() => handleConfirmDeleteProfile(data._id)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MyAccount
