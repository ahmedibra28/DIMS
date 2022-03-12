import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Admin from '../components/dashboard/Admin'
import { Access, UnlockAccess } from '../utils/UnlockAccess'
import Student from '../components/dashboard/Student'
import Instructor from '../components/dashboard/Instructor'

function Home() {
  return (
    <div>
      <Head>
        <title>DIMS</title>
        <meta property='og:title' content='DIMS' key='title' />
      </Head>
      {UnlockAccess(Access.adminFinance) && <Admin />}
      {UnlockAccess(Access.student) && <Student />}
      {UnlockAccess(Access.instructor) && <Instructor />}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
