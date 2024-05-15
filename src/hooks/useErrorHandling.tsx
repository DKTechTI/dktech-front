import { AxiosError, isAxiosError } from 'axios'
import toast from 'react-hot-toast'

interface HandleErrorResponseProps {
  error: Error | AxiosError
  errorReference: { [errorStatus: number]: { [keyMessage: string]: string } }
  defaultErrorMessage: string
}

const useErrorHandling = () => {
  const handleErrorResponse = ({ error, errorReference, defaultErrorMessage }: HandleErrorResponseProps) => {
    if (!isAxiosError(error)) return toast.error(defaultErrorMessage)

    if (error.response) {
      if (
        errorReference &&
        errorReference[error.response.status] &&
        errorReference[error.response.status][error.response.data.message]
      )
        return toast.error(errorReference[error.response.status][error.response.data.message])
    }

    return toast.error(defaultErrorMessage)
  }

  return { handleErrorResponse }
}

export default useErrorHandling
