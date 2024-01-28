'use client'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title?: string
  margin?: string
  showFooter?: boolean
}

const FormContainer: React.FC<Props> = ({
  children,
  title,
  margin = '',
  showFooter = true,
}) => {
  return (
    <div className={`mx-auto max-w-6xl ${margin} w-full`}>
      <div className='w-92 max-auto flex h-[85vh] flex-row items-center justify-center'>
        <div className='w-full bg-white p-6 duration-1000 sm:w-[80%] md:w-[70%] lg:w-[45%]'>
          {title && (
            <div className='mb-10 space-y-3'>
              <div className='text-center text-3xl uppercase text-primary'>
                {title}
              </div>
            </div>
          )}
          {children}

          {showFooter && (
            <div className='mt-10 space-y-3 text-center'>
              <hr />
              <div>CONTACT</div>
              <a
                className='font-light text-gray-500 underline'
                href='mailto:info@ahmedibra.com'
              >
                info@ahmedibra.com
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormContainer
