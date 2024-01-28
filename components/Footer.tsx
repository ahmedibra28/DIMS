'use client'

import moment from 'moment'

const Footer = () => {
  const year = moment().format('YYYY')
  return (
    <footer className='footer footer-center text-base-content flex h-[68px] items-center justify-center bg-white text-center font-light'>
      <div>
        <p className='text-gray-400'>
          Copyright © {year} - Developed by
          <a
            className='mx-1 font-bold'
            target='_blank'
            href='https://ahmedibra.com'
            rel='noreferrer'
          >
            Ahmed Ibrahim
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
