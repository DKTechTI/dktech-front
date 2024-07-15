import React, { Component, ErrorInfo, ReactNode } from 'react'
import { styled, Button, Typography, Box, BoxProps } from '@mui/material'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <BoxWrapper>
              <Typography variant='h2' sx={{ mb: 1.5 }}>
                Ops! Algo deu errado :(
              </Typography>
              <Typography sx={{ mb: 6, color: 'text.secondary' }}>
                Parece que ocorreu um problema inesperado. Por favor, tente novamente.
              </Typography>
              <Button onClick={() => this.setState({ hasError: false })} variant='contained'>
                Tentar Novamente
              </Button>
            </BoxWrapper>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
