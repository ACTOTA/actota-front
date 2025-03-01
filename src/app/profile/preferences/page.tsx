"use client"
import Button from '@/src/components/figma/Button';
import Dropdown from '@/src/components/figma/Dropdown';
import React from 'react'

const Preferences = () => {
  return (
    <div className=''>

      <p className='text-2xl font-bold'>Preferences</p>
      <div className='flex justify-between max-sm:flex-col w-full items-center gap-6 mt-8'>
        <div className=' flex-1 max-sm:w-full'>

          <p className='text-sm text-primary-gray mb-2'>Default Language</p>
          <Dropdown options={["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Turkish", "Arabic", "Chinese", "Japanese", "Korean", "Vietnamese", "Other"]} onSelect={() => { }} />
        </div>
        <div className=' flex-1 max-sm:w-full'>

          <p className='text-sm text-primary-gray mb-2'>Display Currency</p>
          <Dropdown options={["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Turkish", "Arabic", "Chinese", "Japanese", "Korean", "Vietnamese", "Other"]} onSelect={() => { }} />
        </div>
      </div>
      <div className='flex justify-between max-sm:flex-col w-full items-center gap-6 mt-8'>
        <div className=' flex-1 max-sm:w-full'>

          <p className='text-sm text-primary-gray mb-2'>Timezone</p>
          <Dropdown options={["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Turkish", "Arabic", "Chinese", "Japanese", "Korean", "Vietnamese", "Other"]} onSelect={() => { }} />
        </div>
        <div className=' flex-1 max-sm:w-full'>

          <div className='flex justify-between max-sm:flex-col w-full items-center gap-6'>
            <div className=' flex-1 max-sm:w-full'>

              <p className='text-sm text-primary-gray mb-2'>Date Format</p>
              <Dropdown options={["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Turkish", "Arabic", "Chinese", "Japanese", "Korean", "Vietnamese", "Other"]} onSelect={() => { }} />
            </div>
            <div className=' flex-1 max-sm:w-full'>

              <p className='text-sm text-primary-gray mb-2'>Time Format</p>
              <Dropdown options={["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Turkish", "Arabic", "Chinese", "Japanese", "Korean", "Vietnamese", "Other"]} onSelect={() => { }} />
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-end mt-8'>
        <Button variant='primary' className='max-sm:w-full'>Save Changes</Button>
      </div>
    </div>
  )
}

export default Preferences;