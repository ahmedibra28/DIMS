import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Admin from '../components/dashboard/Admin'

function Home() {
  return (
    <div>
      <Head>
        <title>DIMS</title>
        <meta property='og:title' content='DIMS' key='title' />
      </Head>
      <Admin />
      {/* <div className='display-1 text-center text-primary'>Dashboard</div> */}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
