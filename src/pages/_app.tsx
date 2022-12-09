import { RecoilRoot } from 'recoil'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '@client/shared/react-query'

import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import '@styles/global.css'

import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        <title>화요뜨락 홈페이지</title>
      </Head>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </RecoilRoot>
    </>
  )
}

export default MyApp
