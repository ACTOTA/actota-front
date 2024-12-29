'use client'

import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import Button from './figma/Button'
const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
]

export default function Footer() {
  return (
    <div className="text-white mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
      <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 grid grid-cols-2">
        <div className='col-span-1'>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className='text-neutral-04 my-10'>Can’t find what you’re looking for?</p>
          <Button className="bg-white text-black">Contact us</Button>
        </div>

        <dl className="mt-10 space-y-6 divide-y divide-gray-900/10 col-span-1">
          {faqs.map((faq) => (
            <Disclosure key={faq.question} as="div" className="pt-6">
              <dt>
                <Disclosure.Button className="group flex w-full items-start justify-between text-left">
                  <span className="text-base/7 font-semibold">{faq.question}</span>
                  <span className="ml-6 flex h-7 items-center">
                    <PlusIcon aria-hidden="true" className="size-6 group-data-open:hidden" />
                    <MinusIcon aria-hidden="true" className="size-6 group-not-data-open:hidden" />
                  </span>
                </Disclosure.Button>
              </dt>
              <Disclosure.Panel as="dd" className="mt-2 pr-12">
                <p className="text-base/7">{faq.answer}</p>
              </Disclosure.Panel>
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  )
}

