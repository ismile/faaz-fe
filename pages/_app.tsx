import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme, { themeDark } from '../configs/theme'
import { useEffect, useState } from 'react'

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
import useSettingStore from '../components/hooks/useSettingStore'
import { NextPage } from 'next'
import { NotificationAdapter } from '../stores/NotificationStore'
import { useAuthStore } from '../stores/AuthStore'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { NAMESPACE } from '../configs/constant'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  Component: NextPage & {
    Layout?: any
  }
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = StyleCache, pageProps } = props
  const [loading, setLoading] = useState(true)
  const [_me] = useAuthStore(
    (state) => [state._me],
    (ps, ns) => true
  )
  const router = useRouter()
  const [mode, _set] = useSettingStore((store) => [store.mode, store._set])

  // init config
  httpConfig()
  useEffect(() => {
    _init()
  }, [])

  const _init = async () => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
    if (router.pathname !== '/account/login') {
      await _me()
    }
    setLoading(false)
  }

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
        <ThemeProvider theme={mode == 'light' ? theme : themeDark}>
          <CssBaseline />
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <LocalizationProvider dateAdapter={DateAdapter}>
              {!loading && Component.Layout && (
                <Component.Layout>
                  <Component {...pageProps} />
                </Component.Layout>
              )}
              {!loading && !Component.Layout && (
                <Layout>
                  <SwitchTransition mode="out-in">
                    <CSSTransition
                      timeout={100}
                      key={router.pathname}
                      classNames="page"
                    >
                      <Component {...pageProps} />
                    </CSSTransition>
                  </SwitchTransition>
                </Layout>
              )}
              <AppDialog />
              <NotificationAdapter />
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
  axios.defaults.headers.common.Authorization =
    'bearer ' + getCookie(`${NAMESPACE}_TOKEN`, ctx)
  return {}
}

export default MyApp
