'use client';

import Container from "../Container";
import Logo from "../Logo";
import { useEffect, useState } from "react";
import { SessionUser } from "@/app/types/session";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import Button from "../figma/Button";
import Link from "next/link";
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const Navbar = () => {

    const [currentUser, setCurrentUser] = useState<SessionUser | null>(null)
    const [loading, setLoading] = useState(true)
    const path = usePathname();

    useEffect(() => {

        console.log("Navbar path: ", path);

        async function loadUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
                console.log("Navbar user: ", user);
            } catch (error) {
                console.error('Failed to load user:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    const handleClick = () => {
        if (path !== "/") {
            window.location.href = "/";
        }
    }


    if (loading) return null

    return (
        <div className="fixed h-16 z-50 w-full text-white flex items-center">
            <div className="py-3 w-full h-full">
                <Container>
                    <div className="flex flex-row items-center justify-between w-full h-full" >
                        <Logo onClick={handleClick} className="hover:cursor-pointer" />
                        {currentUser ? (
                            <div>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full trans neutral-01 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800">
                                            Options
                                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                                        </Menu.Button>
                                    </div>

                                    <Menu.Items
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        <div className="py-1">
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                >
                                                    My Account
                                                </a>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                >
                                                    Duplicate
                                                </a>
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                >
                                                    Archive
                                                </a>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                >
                                                    Move
                                                </a>
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                >
                                                    Share
                                                </a>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                >
                                                    Add to favorites
                                                </a>
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                >
                                                    Delete
                                                </a>
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        ) : (
                            <div>
                                <Link href='/signin'><Button className="hover:cursor-pointer text-white">Sign In</Button></Link>
                                <Link href='/signup'><Button className="hover:cursor-pointer bg-white text-black">Get Started</Button></Link>
                            </div>
                        )}

                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;


