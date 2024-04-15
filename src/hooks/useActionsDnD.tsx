import { useContext } from 'react'
import { ActionsDnDContext } from 'src/context/ActionsDnDContext'

export const useActionsDnD = () => useContext(ActionsDnDContext)
