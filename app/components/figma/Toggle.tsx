
'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

type ToggleProps = {
  enabled: boolean
  setEnabled: (value: boolean) => void
} & React.HTMLAttributes<HTMLButtonElement>

export default function Toggle({ enabled, setEnabled }: ToggleProps) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`
        relative inline-flex h-6 w-12 items-center rounded-full
        ${enabled ? 'bg-blue-600' : 'bg-gray-700'}
        border border-gray-600 transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-0
      `}
    >
      <span className="sr-only">Enable feature</span>
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white
          transition duration-200 ease-in-out
          ${enabled ? 'translate-x-6' : 'translate-x-[2px]'}
        `}
      />
    </Switch>
  )
}

