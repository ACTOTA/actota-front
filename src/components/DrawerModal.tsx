'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';




export default function DrawerModal({isDrawerOpen, children, setIsDrawerOpen}: {isDrawerOpen: boolean, children: React.ReactNode, setIsDrawerOpen: (isDrawerOpen: boolean) => void}) {

  return (
    <div className=" ">
      {/* Mobile filter dialog */}
      <Transition.Root show={isDrawerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={()=>setIsDrawerOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex ">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col  h-full max-w-2xl bg-black  ml-auto overflow-y-auto  shadow-xl">
             

               {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

     
    </div>
  );
}
