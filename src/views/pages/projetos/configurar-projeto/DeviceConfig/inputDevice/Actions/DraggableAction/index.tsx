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
import { useAutoSave } from 'src/hooks/useAutoSave'

import useErrorHandling from 'src/hooks/useErrorHandling'
import projectSceneActionsErrors from 'src/errors/projectSceneActionsErrors'
import { handleCheckItemsFrontAndBackOnDelete } from 'src/utils/actions'

interface DraggableActionProps {
  row: any
  index: number
}

const DraggableAction = ({ row, index }: DraggableActionProps) => {
  const { setActions, actions, setRefreshScenes, refreshActions, setRefreshActions } = useActionsDnD()
  const { handleSaveOnStateChange } = useAutoSave()
  const { handleErrorResponse } = useErrorHandling()

  const [actionId, setActionId] = useState('')
  const [type, setType] = useState<ValueType | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleConfirmDeleteAction = (id: string, index: number) => {
    const operationCheck = handleCheckItemsFrontAndBackOnDelete(actions, index, 'DELAY')

    if (!operationCheck) return toast.error('Não é possível deletar a ação, pois delays não podem ficar em sequência.')

    api
      .delete(`/projectSceneActions/${id}`)
      .then(response => {
        if (response.status === 200) {
          setRefreshScenes(true)
          setRefreshActions(!refreshActions)
          toast.success('Ação deletada com sucesso!')
        }
      })
      .catch(error => {
        handleErrorResponse({
          error: error,
          errorReference: projectSceneActionsErrors,
          defaultErrorMessage: 'Erro ao deletar ação, tente novamente mais tarde.'
        })
      })
      .finally(() => {
        setDeleteDialogOpen(false)
      })
  }

  const handleFormData = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, createdAt, updatedAt, ...formattedData } = data

    return formattedData
  }

  const createSchema = (actionType: ValueType): yup.ObjectSchema<any> => {
    if (!actionType) return {} as yup.ObjectSchema<any>

    const baseSchema = {
      actionValueReles: yup.string().when('type', ([type], schema) => {
        return type == 'actionValueReles' ? schema.required('Valor obrigatório') : schema.notRequired()
      }),
      actionValueDimmer: yup
        .string()
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
    formState: { errors },
    handleSubmit
  } = useForm<any>({
    values: row,
    mode: 'onBlur',
    resolver: yupResolver(createSchema(type as ValueType))
  })

  const handleInputChange = (key: string, value: any) => {
    setValue(key, value)
    setActions(actions.map((action: any) => (action._id === row._id ? { ...action, [key]: value } : action)))
    setIsDirty(true)
  }

  const onSubmit = (data: any): void => {
    if (isDirty) {
      const formattedData = handleFormData(data)
      handleSaveOnStateChange(`/projectSceneActions/${row._id}`, formattedData, 'PUT')
      setIsDirty(false)
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
        handleConfirmDelete={() => handleConfirmDeleteAction(actionId, index)}
      />

      <Draggable key={row._id} draggableId={row._id} index={index}>
        {provider => (
          <TableRow {...provider.draggableProps} ref={provider.innerRef}>
            <TableCell {...provider.dragHandleProps} sx={{ minWidth: '140px' }}>
              <Typography>{row.name}</Typography>
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
                        onChange={(e: any) => handleInputChange(type, e.target.value)}
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
