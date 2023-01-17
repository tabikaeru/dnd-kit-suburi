import '~/styles/reset.css'
import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { DndContext } from '@dnd-kit/core'
import { theme } from '~/styles/theme'
import createEmotionCache from '~/createEmotionCache'
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const MyApp = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <DndContext>
            <Component {...pageProps} />
          </DndContext>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  )
}

export default MyApp
