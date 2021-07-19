import React from 'react'

const Footer = () => {
  return (
    <footer>
      <div className='container mt-5 pt-5'>
        <div className='row'>
          <div className='col text-center py-3'>
            Copyright &copy;{' '}
            <a href='https://geeltech.com' target='blank'>
              Geel Tech
            </a>
          </div>
          <div className='col text-center py-3'>
            Email:{' '}
            <a href='mailto:info@geeltech.com' target='blank'>
              info@geeltech.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
