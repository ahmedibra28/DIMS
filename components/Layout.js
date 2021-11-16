import Navigation from './Navigation'
import Head from 'next/head'
import Canvas from './Canvas'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>DIMS</title>
        <meta property='og:title' content='DIMS' key='title' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navigation />
      <Canvas />
      <div className='container'>{children}</div>
    </>
  )
}
