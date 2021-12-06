import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../configs/theme'
import { useEffect } from 'react'
import Toolbar from '@mui/material/Toolbar'

import '../styles/globals.css'
import Layout from '../components/layout'
import { AppDialog } from '../components/hooks/useModal'
import { SnackbarProvider } from 'notistack'
import httpConfig from '../configs/http'
import { useRouter } from 'next/dist/client/router'
import createCache, { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { StyleCache } from '../configs/cache'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateAdapter from '@mui/lab/AdapterDayjs'
import CSSTransition from 'react-transition-group/CSSTransition'
import SwitchTransition from 'react-transition-group/SwitchTransition'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = StyleCache, pageProps } = props
  // init config
  httpConfig()

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const router = useRouter()

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>My page</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <LocalizationProvider dateAdapter={DateAdapter}>
              <Layout>
                <SwitchTransition mode="out-in">
                  <CSSTransition
                    timeout={100}
                    key={router.pathname}
                    classNames="page"
                    // addEndListener={(node, done) => {
                    //   node.addEventListener("transitionend", done, false);
                    // }}
                  >
                    <Component {...pageProps} />
                  </CSSTransition>
                </SwitchTransition>
                <AppDialog />
              </Layout>
            </LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

MyApp.getInitialProps = async function (ctx) {
  httpConfig()
  return {}
}

export default MyApp
