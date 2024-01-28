'use client'

import React from 'react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { FaTrash } from 'react-icons/fa6'
import { Button } from './ui/button'

const Confirm = (action: () => void) => {
  return {
    customUI: ({ onClose }: { onClose: () => void }) => {
      return (
        <div className='text-dark min-w-6xl w-auto rounded-lg border border-gray-500 p-5 text-center shadow-2xl md:w-96'>
          <h1 className='text-lg font-bold'>Are you sure?</h1>
          <p className='mb-5'>You want to delete this?</p>
          <div className='mt-2 flex items-center justify-around'>
            <Button
              tabIndex={0}
              className='btn bg-green-500 text-white'
              onClick={onClose}
            >
              No
            </Button>

            <Button
              tabIndex={0}
              className='btn bg-red-500 text-white'
              onClick={() => {
                action()
                onClose()
              }}
            >
              <FaTrash className='mr-1' /> Yes, Delete it!
            </Button>
          </div>
        </div>
      )
    },
  }
}

export default Confirm
