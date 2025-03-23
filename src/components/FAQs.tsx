'use client'

import React from 'react'
import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import Button from './figma/Button'

const FAQs = () => {
    const faqs = [
        {
            question: "✨ What is ACTOTA?",
            answer:
                "ACTOTA is your portal to the infinite—an online travel agency that is the key to your personal gateway.  We curate immersive journeys—handpicked experiences designed for those who seek meaning in motion and luxury in the natural world. ACTOTA is not a marketplace. It’s a sanctuary for refined exploration.",
        },
        {
            question: "🧭 How does ACTOTA work?",
            answer:
                "ACTOTA is your private concierge—powered by intelligent design. Whether you're planning a once-in-a-lifetime expedition or an impromptu escape, our platform builds bespoke itineraries in seconds. Every detail—lodging, flights, exclusive experiences, private guides—is seamlessly aligned and entirely customizable.",
        },
        {
            question: "🌐 What kind of journeys can I expect?",
            answer:
                "Private heli-skiing over alpine silence. Restorative retreats tucked into ancient forests. Culinary immersions guided by artisans. Whether you're in pursuit of awe or stillness, ACTOTA offers elevated experiences that honor your pace, privacy, and purpose.",
        },
        {
            question: "🌟 What sets ACTOTA apart from other luxury travel services?",
            answer:
                <div className="max-w-2xl mx-auto">
                    <p className="mb-4">
                        ACTOTA blends <strong>high-touch curation with cutting-edge ai</strong>, offering a platform as intuitive as it is elegant. beyond service, we offer <em>stewardship</em>—ensuring your journey is not just smooth, but sacred.
                    </p>
                    <p className="font-bold mb-2">What you'll find here:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li className="mb-1">Effortless itinerary generation</li>
                        <li className="mb-1">Fine-tuned personalization</li>
                        <li className="mb-1">World-class local guides</li>
                        <li className="mb-1">Intelligent routing and logistics</li>
                        <li className="mb-1">Discreet cost-sharing tools for group travel</li>
                        <li className="mb-1">Voice-enabled trip planning (coming soon)</li>
                        <li className="mb-1">A centralized "Adventure Hub" for every detail of your journey</li>
                    </ul>
                    <p className="mb-4">
                        and above all: <em>simplicity wrapped in beauty.</em>
                    </p>
                </div>
        },
        {
            question: "💼 Does ACTOTA charge a service fee?",
            answer: <p>Yes. A <b>5% concierge fee</b> is added to each booking. This ensures we can maintain the highest standards of personalized service, innovation, and platform integrity—without ever compromising your experience with ads or noise.</p>
        },
        {
            question: "🔁 Can I change or cancel a booking?",
            answer: "Absolutely. Most experiences offer flexible terms, and our platform makes modifications effortless. You may also soon manage your entire journey via simple voice command. As your travel evolves, ACTOTA evolves with you."
        },
        {
            question: "🤝 Who provides the experiences on ACTOTA?",
            answer: "We partner with a selective network of exceptional guides, boutique operators, and destination hosts—each vetted for excellence, sustainability, and their capacity to offer something rare. These aren’t mass-market tours. They’re experiences with soul."
        },
        {
            question: "🧭 What is the “AI Compass”?",
            answer: <p>The <b>AI Compass</b> is your intelligent travel whisperer. It senses your rhythm, your preferences, your desire for discovery—and offers curated options you might not have thought to seek. It is part intuition, part innovation.</p>
        },
        {
            question: "🏔 Is ACTOTA focused only on Colorado?",
            answer: "Colorado is our genesis—where wild beauty, elevated living, and spiritual depth converge. But ACTOTA is global in scope, with a growing portfolio of curated experiences spanning continents and cultures. Wherever meaning calls, we aim to follow."
        },
        {
            question: "📱 Is there an ACTOTA mobile app?",
            answer: "A dedicated mobile experience is on the horizon. For now, our platform is designed to flow beautifully across all devices, allowing you to explore and book with elegance—whether from your penthouse suite or your villa terrace."
        },
        {
            question: "👤 Can I host or list a private experience on ACTOTA?",
            answer: <p>Yes. If you are a guide, host, or retreat leader offering elevated, high-integrity experiences, we invite you to join our private <b>Guide Marketplace</b>. Reach out through our Supplier Portal, and a member of our team will connect personally.</p>
        }
    ]
    return (
        <div className="text-white  2xl:mx-auto max-w-[1440px] sm:m-[80px] m-4 ">
            <div className="mx-auto   divide-gray-900/10 flex justify-between items-start max-sm:flex-col flex-wrap gap-10">
                <div className='flex-1 '>
                    <h2 className="text-2xl font-bold sm:leading-[80px]  sm:text-[64px]">
                        Frequently Asked Questions
                    </h2>
                    <p className='text-primary-gray my-10 max-sm:hidden'>Can’t find what you’re looking for?</p>
                    <Button variant="primary" className="bg-white text-black max-sm:hidden">Contact us</Button>
                </div>

                <dl className=" flex-1  divide-gray-900/10 -mt-4">
                    {faqs.map((faq, i) => (
                        <Disclosure key={i} as="div" className="pt-6 w-full">
                            <dt>
                                <Disclosure.Button className="group flex w-full items-start justify-between text-left">
                                    <span className="sm:text-[20px] font-bold">{faq.question}</span>
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
