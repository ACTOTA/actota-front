'use client';

import { activities } from './Activities';
import { Fragment, useState } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import LodgingDetailsCounter from './LodgingDetailsCounter';
import ListingCard from '../components/listings/ListingCard';
import EmptyState from "@/app/components/EmptyState";

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
];
// const subCategories = [
//   { name: 'Featured', href: '#' },
// ];


const filters = [
  {
    id: 'price',
    name: 'Price',
    options: [
      { value: '9000', label: '$9,000+ Per Person', checked: false },
      { value: '7500', label: '<$7,500+ Per Person', checked: false },
      { value: '5000', label: '<$5,000+ Per Person', checked: false },
      { value: '2500', label: '<$2,500+ Per Person', checked: false },
      { value: '1000', label: '<$1,000+ Per Person', checked: false },
      { value: '500', label: '<$500+ Per Person', checked: false },
    ],
  },
  {
    id: 'activity',
    name: 'Activity',
    options: activities.map(activity => ({
      value: activity.label.toLowerCase().replace(/\s+/g, '-'), // Convert label to a URL-friendly format
      label: activity.label,
      checked: false, // Default all to unchecked
    })),
  },
  {
    id: 'interest',
    name: 'Interests',
    options: activities.map(activity => ({
      value: activity.label.toLowerCase().replace(/\s+/g, '-'), // Convert label to a URL-friendly format
      label: activity.label,
      checked: false, // Default all to unchecked
    })),
  },
  {
    id: 'lodging',
    name: 'Lodging',
    options: [
      { value: 'airbnb', label: 'AirBnb', checked: false },
      { value: 'cabin', label: 'Cabin', checked: false },
      { value: 'hotel', label: 'Hotel', checked: true },
      { value: 'glamping', label: 'Glamping', checked: false },
      { value: 'camping', label: 'Camping', checked: false },
      { value: 'none', label: 'None', checked: false },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Filter() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [activeLodging, setActiveLodging] = useState('none');

  return (
    <div className="bg-white">
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium gray-900 gradient-underline">Itinerary Tuner</h2>

                  <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4 border-t border-gray-200">
                  <h3 className="sr-only">Categories</h3>
                  {/* <ul role="list" className="px-2 py-3 font-medium text-gray-900">
    {subCategories.map((category) => (
      <li key={category.name}>
        <a href={category.href} className="block px-2 py-3">
          {category.name}
        </a>
      </li>
    ))}
  </ul> */}

                  {filters.map((section) => (
                    <Disclosure as="div" key={section.id} className="px-4 py-6 border-t border-gray-200">
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -mx-2 -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-900">{section.name}</span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusIcon className="w-5 h-5" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="w-5 h-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="flex-1 min-w-0 ml-3 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                              {activeLodging !== 'none' && <LodgingDetailsCounter />}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between my-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900"></h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center text-sm font-medium text-gray-700 group hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={classNames(
                              option.current ? 'text-Nunito font-medium text-gray-900' : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="p-2 ml-5 m-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">View filters</span>
              <FunnelIcon className="w-5 h-5" aria-hidden="true" />
            </button>

            <button type="button" className="p-2 ml-4 -m-2 text-gray-400 hover:text-gray-500 sm:ml-6">
              <span className="sr-only">View grid</span>
              <Squares2X2Icon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="py-4 border-gray-200 border-t">
          <h2 id="products-heading" className="sr-only">Products</h2>

          <div className="">
            Product Grid
            <div className="col-span-1">
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
