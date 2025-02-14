'use client';

import Container from "../Container";
import Logo from "../Logo";
import { useEffect, useState } from "react";
import { SessionUser } from "@/src/types/session";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/src/helpers/auth";
import Button from "../figma/Button";
import Link from "next/link";
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { signOut } from "@/src/helpers/auth";
import Image from "next/image";
import { LuUser } from "react-icons/lu";
import DrawerModal from "../DrawerModal";
import NotificationsDrawer from "./NotificationsDrawer";

const Navbar = () => {
    const pathname = usePathname();
    const isAuthRoute = pathname?.startsWith('/auth');
    const [currentUser, setCurrentUser] = useState<SessionUser | any>(null)
    const [loading, setLoading] = useState(true)
    const path = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    useEffect(() => {
        console.log("Navbar path: ", path);

        async function loadUser() {
            try {
                // const user = await getCurrentUser();
                let user = {
                    first_name: "Johnny",
                    last_name: "John",
                    email: "johnnyjohn@gmail.com",
                    // image: "https://via.placeholder.com/150",
                    _id: "123",
                    created_at: new Date(),
                    updated_at: new Date(),
                }
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

    async function handleSignout() {
        setCurrentUser(null);
        // await signOut();
        window.location.href = "/";
    }

    if (loading) return null

    return (
        <div>

        <div className={`fixed h-[82px] z-30 w-full bg-black/90 backdrop-blur-sm text-white flex items-center ${isAuthRoute ? 'hidden' : ''}`}>
            <div className="py-3 w-full h-full">
                <Container>
                    <div className="flex flex-row items-center justify-between w-full h-full" >
                        <Logo onClick={handleClick} className="hover:cursor-pointer z-50" />

                        {currentUser ? (
                            <div>
                                <Menu as="div" className="relative inline-block text-left text-white">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setIsDrawerOpen(true)} className="rounded-full  text-white flex items-center justify-center p-4 border border-[#424242] relative"> <Image src="/svg-icons/notification.svg" alt="User" width={28} height={28} className="rounded-full" /> <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" /> </button>
                                        <Menu.Button className="inline-flex w-full justify-center items-center pr-4 gap-x-1.5 rounded-full  p-1 text-sm font-semibold text-white shadow-sm border border-[#424242] hover:bg-gray-800">
                                            {currentUser.image ? <Image src={currentUser.image} alt="User" width={32} height={32} className="rounded-full" /> : <div className="rounded-full bg-[#00122D] text-white flex items-center justify-center p-3"> <LuUser className="w-6 h-6" /> </div>}
                                            <p>{(currentUser.first_name && currentUser.last_name) ? (currentUser.first_name + " " + currentUser.last_name) : currentUser.email}</p>
                                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-white" />
                                        </Menu.Button>
                                    </div>

                                    <Menu.Items
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-black/90 border border-white/20 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        <div className="">
                                            <Menu.Item>
                                                <Link href="/profile" className="block px-4 py-2 pt-3 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none 
                                                    hover:bg-red-500/20 hover:rounded-t-md">
                                                    Profile
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>

                                                <Link href="/profile/favorites" className="block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none 
                                                    hover:bg-red-500/20">
                                                    Favorites
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Link href="/profile/bookings" className="block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none 
                                                    hover:bg-red-500/20">
                                                    My Bookings
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Link href="/profile/payments" className="block px-4 py-2 pb-3 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none 
                                                    hover:bg-red-500/20">
                                                    Payments
                                                </Link>
                                            </Menu.Item>

                                        </div>
                                        <div className="">
                                            <Menu.Item>
                                                <Link href="#" className="block px-4 py-2 pt-3 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none 
                                                    hover:bg-red-500/20">
                                                    Help Center
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Link href="#" className="block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none 
                                                    hover:bg-red-500/20">
                                                    Preferences
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <div className="block px-4 py-2 pb-3 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none 
                                                    hover:bg-red-500/20 hover:rounded-b-md" onClick={handleSignout}>
                                                    Sign Out
                                                </div>
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        ) : (
                            <div className="flex gap-2 z-50">
                                <Link href='/auth/signin'><Button variant="simple" className="hover:cursor-pointer text-white">Log In</Button></Link>
                                <Link href='/auth/signup'><Button variant="primary" className="hover:cursor-pointer bg-white text-black">Get Started</Button></Link>
                            </div>
                        )}
                    </div>
                </Container>
                </div>
            </div>
            <DrawerModal
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
            >
               <NotificationsDrawer setIsDrawerOpen={setIsDrawerOpen} />
            </DrawerModal>
        </div>
    );
}

export default Navbar;


