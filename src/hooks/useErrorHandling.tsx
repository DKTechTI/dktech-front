interface HandleErrorResponseProps {
  error: number
  message: string
  referenceError: { [errorStatus: number]: { [keyMessage: string]: string } }
}

const useErrorHandling = () => {
  const handleErrorResponse = ({ error, message, referenceError }: HandleErrorResponseProps) => {
    if (referenceError && referenceError[error] && referenceError[error][message]) return referenceError[error][message]

    return null
  }

  return { handleErrorResponse }
}

export default useErrorHandling
