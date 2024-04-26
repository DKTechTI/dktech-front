import { useContext } from 'react'
import { AutoSaveContext } from 'src/context/AutoSaveContext'

export const useAutoSave = () => useContext(AutoSaveContext)
