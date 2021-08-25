import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../configs/theme'
import { useEffect } from 'react'
import Toolbar from '@material-ui/core/Toolbar'

import '../styles/globals.css'
import Layout from '../components/layout'
import { AppDialog } from '../components/hooks/useModal'
import { SnackbarProvider } from 'notistack'
import httpConfig from '../configs/http'
import { useRouter } from 'next/dist/client/router'
import TinyTransition from "react-tiny-transition";

function MyApp({ Component, pageProps }: AppProps) {
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
      <StylesProvider injectFirst>
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
            <Layout>
              <TinyTransition duration={800} key={router.pathname}>
                <Component {...pageProps} />
              </TinyTransition>
              <AppDialog />
            </Layout>
          </SnackbarProvider>
        </ThemeProvider>
      </StylesProvider>
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
};

export default MyApp
