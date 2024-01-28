import React from 'react'

const Loading = () => {
  return (
    <div className='mt-16 overflow-x-auto bg-white p-3 '>
      <div className='mb-2 flex flex-col items-center'>
        <h1 className='h-5 w-full animate-pulse text-2xl font-light dark:bg-gray-700 md:w-[40%]'></h1>
        <h1 className='mt-5 h-10 w-28 animate-pulse text-2xl font-light dark:bg-gray-700'></h1>

        <h1 className='mt-5 h-12 w-64 animate-pulse text-2xl font-light dark:bg-gray-700'></h1>
        <div className='mx-auto w-full sm:w-[80%] md:w-[50%] lg:w-[30%]'></div>
      </div>

      <div className='mt-10 h-72 w-full'>
        <div className='mb-3 h-4 w-[100%] animate-pulse bg-gray-300 dark:bg-gray-700 md:w-[70%]'></div>

        <div className='mb-3 h-4 w-[90%] animate-pulse bg-gray-300 dark:bg-gray-700 md:w-[50%]'></div>

        <div className='mb-3 h-4 w-[70%] animate-pulse bg-gray-300 dark:bg-gray-700 md:w-[90%]'></div>

        <div className='mb-3 h-4 w-[40%] animate-pulse bg-gray-300 dark:bg-gray-700 md:w-[30%]'></div>

        <div className='mb-3 h-4 w-[30%] animate-pulse bg-gray-300 dark:bg-gray-700 md:w-[50%]'></div>

        <div className='mb-3 h-4 w-[50%] animate-pulse bg-gray-300 dark:bg-gray-700 md:w-[90%]'></div>
      </div>
    </div>
  )
}

export default Loading
