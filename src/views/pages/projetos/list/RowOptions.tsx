import { useState, MouseEvent } from 'react'

import { useRouter } from 'next/router'

import { Button, IconButton, Menu, MenuItem, useMediaQuery, Box } from '@mui/material'
import DialogAlert from 'src/@core/components/dialogs/dialog-alert'
import Icon from 'src/@core/components/icon'

interface RowOptionsProps {
  id: string
  clientId: string
  handleConfirmDelete: (id: string) => void
}

const RowOptions = ({ id, clientId, handleConfirmDelete }: RowOptionsProps) => {
  const router = useRouter()

  const matches = useMediaQuery('(min-width:600px)')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [open, setOpen] = useState(false)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleViewProjectClick = () => {
    router.push(`/clientes/${clientId}`)
  }

  const handleDeleteProjectClick = () => {
    setOpen(true)
  }

  return (
    <>
      {matches ? (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            padding: '0 8 0 0 '
          }}
        >
          <Button size='small' variant='outlined' color='primary' onClick={handleViewProjectClick}>
            Ver Projeto
          </Button>
          <Button size='small' variant='outlined' color='primary' onClick={handleDeleteProjectClick}>
            Deletar
          </Button>
        </Box>
      ) : (
        <>
          <IconButton size='small' onClick={handleRowOptionsClick}>
            <Icon icon='tabler:dots-vertical' />
          </IconButton>
          <Menu
            keepMounted
            anchorEl={anchorEl}
            open={rowOptionsOpen}
            onClose={handleRowOptionsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            PaperProps={{ style: { minWidth: '8rem' } }}
          >
            <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleViewProjectClick}>
              <Icon icon='tabler:eye' fontSize={20} />
              Ver Projeto
            </MenuItem>
            <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleDeleteProjectClick}>
              <Icon icon='tabler:trash' fontSize={20} />
              Deletar
            </MenuItem>
          </Menu>
        </>
      )}

      <DialogAlert
        id={id}
        open={open}
        setOpen={setOpen}
        question={'Você tem certeza que deseja deletar este projeto?'}
        description={' Esta ação não poderá ser desfeita.'}
        handleConfirmDelete={() => handleConfirmDelete(id)}
      />
    </>
  )
}

export default RowOptions
