import FormContainer from '@/components/FormContainer'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({ title: '404' }),
}

export default function NotFound() {
  return (
    <>
      <FormContainer title='404'>
        <h1 className='text-center text-red-500'>This page does not exist.</h1>
        <h2 className='text-center text-red-500'>
          Please go back to the home page.
        </h2>

        <div className='my-3 text-center'>
          <Link href='/' className='btn btn-outline btn-primary'>
            Go Back
          </Link>
        </div>
      </FormContainer>
    </>
  )
}
