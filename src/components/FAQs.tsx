'use client'

import React from 'react'
import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import Button from './figma/Button'

const FAQs = () => {
    const faqs = [
        {
            question: "What's the best thing about Switzerland?",
            answer:
                "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
        },
        {
            question: "What's the best thing about Switzerland?",
            answer:
                "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
        },
        {
            question: "What's the best thing about Switzerland?",
            answer:
                "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
        },
        // More questions...
    ]
    return (
        <div className="text-white mx-[80px] 2xl:mx-auto max-w-[1440px] my-[80px] ">
            <div className="mx-auto   divide-gray-900/10 flex justify-between items-start gap-10">
                <div className='flex-1'>
                    <h2 className="text-4xl font-bold leading-[80px]  sm:text-[64px]">
                        Frequently asked questions
                    </h2>
                    <p className='text-primary-gray my-10'>Can’t find what you’re looking for?</p>
                    <Button className="bg-white text-black">Contact us</Button>
                </div>

                <dl className=" flex-1  divide-gray-900/10 -mt-4">
                    {faqs.map((faq) => (
                        <Disclosure key={faq.question} as="div" className="pt-6">
                            <dt>
                                <Disclosure.Button className="group flex w-full items-start justify-between text-left">
                                    <span className="text-[20px] font-bold">{faq.question}</span>
                                    <span className="ml-6 flex h-7 items-center">
                                        <PlusIcon aria-hidden="true" className={`size-6 group-data-open:hidden`} />
                                        
                                        {/* <MinusIcon aria-hidden="true" className="size-6 group-not-data-open:hidden" /> */}
                                    </span>
                                </Disclosure.Button>
                            </dt>
                            <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                <p className="text-primary-gray">{faq.answer}</p>
                            </Disclosure.Panel>
                        </Disclosure>
                    ))}
                </dl>
            </div>
        </div>
    )
}

export default FAQs