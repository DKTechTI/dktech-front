import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

interface DynamicSEOProps {
  defaultTitle: string
}

const formatURL = (url: string) => {
  const parts = url.split('/')

  const firstPart = parts.find(part => part.trim() !== '')

  if (firstPart) {
    const firstPartWithoutSpecialChars = firstPart.replace(/[-_]/g, ' ')
    const formattedFirstPart =
      firstPartWithoutSpecialChars.charAt(0).toUpperCase() + firstPartWithoutSpecialChars.slice(1)

    return formattedFirstPart
  }

  return ''
}

const DynamicSEO = ({ defaultTitle }: DynamicSEOProps) => {
  const router = useRouter()

  const url = formatURL(router.pathname)

  return <NextSeo title={`${defaultTitle} - ${url}`} description={`${defaultTitle} - ${url}`} />
}

export default DynamicSEO
