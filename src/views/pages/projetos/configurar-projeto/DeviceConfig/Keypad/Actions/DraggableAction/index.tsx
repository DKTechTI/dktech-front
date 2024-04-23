import React, { useEffect, useState } from 'react'
import { Button, TableCell, TableRow, Typography } from '@mui/material'

import { useActionsDnD } from 'src/hooks/useActionsDnD'

import IconifyIcon from 'src/@core/components/icon'

import toast from 'react-hot-toast'
import { Draggable } from 'react-beautiful-dnd'

import DialogAlert from 'src/@core/components/dialogs/dialog-alert'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { api } from 'src/services/api'

import { ValueType, typeMap } from './typeMap'

interface DraggableActionProps {
  row: any
  index: number
}

const DraggableAction = ({ row, index }: DraggableActionProps) => {
  const { setActions, actions } = useActionsDnD()

  const [actionId, setActionId] = useState('')
  const [type, setType] = useState<ValueType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleConfirmDeleteAction = (id: string) => {
    api
      .delete(`/projectSceneActions/${id}`)
      .then(response => {
        if (response.status === 200) {
          setActions(actions.filter((action: any) => action._id !== id))
          setDeleteDialogOpen(false)
          toast.success('Ação deletada com sucesso!')
        }
      })
      .catch(() => {
        setDeleteDialogOpen(false)
        toast.error('Erro ao deletar ação, tente novamente mais tarde!')
      })
  }

  const handleInputChange = (key: string, value: any) => {
    setValue(key, value)
  }

  const handleFormData = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, createdAt, updatedAt, ...formattedData } = data

    return formattedData
  }

  const createSchema = (actionType: ValueType): yup.ObjectSchema<any> => {
    if (!actionType) return {} as yup.ObjectSchema<any>

    const baseSchema = {
      actionValueReles: yup.string().when('type', ([type], schema) => {
        return type == 'actionValueReles' ? schema.required('Valor obrigatório') : schema.notRequired()
      }),
      actionValueDimmer: yup
        .number()
        .typeError('Valor deve ser um número')
        .min(0, 'Valor deve ser entre 0 e 100')
        .max(100, 'Valor deve ser entre 0 e 100')
        .when('type', ([type], schema) => {
          return type == 'actionValueDimmer' ? schema.required('Valor obrigatório') : schema.notRequired()
        }),
      actionValueDelay: yup
        .number()
        .typeError('Valor deve ser um número')
        .min(0.1)
        .max(60)
        .when('type', ([type], schema) => {
          return type == 'actionValueDelay' ? schema.required('Valor obrigatório') : schema.notRequired()
        }),
      actionValueEngine: yup.string().when('type', ([type], schema) => {
        return type == 'actionValueEngine' ? schema.required('Valor obrigatório') : schema.notRequired()
      })
    }

    return yup.object().shape(baseSchema).defined()
  }

  const {
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
    handleSubmit
  } = useForm<any>({
    defaultValues: row,
    mode: 'onBlur',
    resolver: yupResolver(createSchema(type as ValueType))
  })

  const onSubmit = (data: any): void => {
    if (isDirty) {
      api
        .put(`/projectSceneActions/${data._id}`, handleFormData(data))
        .then(response => {
          if (response.status === 200) {
            toast.success('Ação atualizada com sucesso!')
            reset(watch(), { keepValues: false, keepDirty: false, keepDefaultValues: false })
          }
        })
        .catch(() => {
          toast.error('Erro ao atualizar ação, tente novamente mais tarde!')
        })
    }
  }

  useEffect(() => {
    if (row) {
      const keys = Object.keys(row)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as ValueType
        if (typeMap[key]) {
          setType(key)
          break
        }
      }
    }
  }, [row])

  if (!row) {
    return null
  }

  return (
    <>
      <DialogAlert
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        question='Você tem certeza que deseja deletar esta ação?'
        description='Esta ação não poderá ser desfeita'
        handleConfirmDelete={() => handleConfirmDeleteAction(actionId)}
      />

      <Draggable key={row._id} draggableId={row.boardId} index={index}>
        {provider => (
          <TableRow {...provider.draggableProps} ref={provider.innerRef}>
            <TableCell {...provider.dragHandleProps} sx={{ minWidth: '140px' }}>
              <Typography>{row.boardId}</Typography>
            </TableCell>
            <TableCell align='right'>
              {type && (
                <Controller
                  name={type}
                  control={control}
                  render={({ field }) => {
                    const { Input, options, inputProps, startAdornment } = typeMap[type]

                    return (
                      <Input
                        field={field}
                        errors={errors}
                        options={options}
                        inputProps={inputProps}
                        startAdornment={startAdornment}
                        onChange={(value: any) => handleInputChange(type, value)}
                        handleSubmit={handleSubmit(onSubmit)}
                      />
                    )
                  }}
                />
              )}
            </TableCell>
            <TableCell align='right'>
              <Button
                onClick={() => {
                  setActionId(row._id)
                  setDeleteDialogOpen(true)
                }}
              >
                <IconifyIcon fontSize='1.75rem' icon='tabler:trash' />
              </Button>
            </TableCell>
          </TableRow>
        )}
      </Draggable>
    </>
  )
}

export default DraggableAction
