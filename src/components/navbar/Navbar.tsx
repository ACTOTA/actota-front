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
import { STEPS } from "@/src/types/steps";
import Search from "./Search";
import { useLogout } from "@/src/hooks/mutations/auth.mutation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

const Navbar = () => {
  const { mutate: signOut, isPending } = useLogout();
  const { user,isAuthenticated } = useAuth();
  const router = useRouter();
    const pathname = usePathname();
    const isAuthRoute = pathname?.startsWith('/auth');
    const [currentUser, setCurrentUser] = useState<  any>(null)
    const [currStep, setCurrStep] = useState<STEPS | null>(null);
    const [classes, setClasses] = useState<string>('');
    const [loading, setLoading] = useState(true)
    const path = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    const handleClick = () => {
        if (path !== "/") {
            router.push("/");
        }
    }

    useEffect(() => {
        console.log("user in navbar", user);
        if(user) {
            setCurrentUser(user);
        }else{
            router.push('/auth/signin');
            setCurrentUser(null);
        }
    }, [user])

    async function handleSignout() {
        setCurrentUser(null);
        signOut();
        router.push('/auth/signin');
    }

    // if (loading) return null

    return (
        <div>

            <div className={`fixed h-[78px] z-30 w-full bg-black/70 backdrop-blur-sm text-white flex items-center ${isAuthRoute ? 'hidden' : ''}`}>
                <div className="py-2 w-full h-full px-4 sm:px-[64px] " >
                    {/* <Container> */}
                    <div className="flex flex-row items-start justify-between w-full h-full" >
                        <Logo onClick={handleClick} className="hover:cursor-pointer z-50 mt-5" />

                        {window.location.pathname !== "/" && <div className="z-50 max-md:hidden">

                            <Search setClasses={setClasses} currStep={currStep} setCurrStep={setCurrStep} navbar={true} />
                        </div>}

                        {currentUser ? (
                            <div className="mt-1">
                                <Menu as="div" className="relative inline-block text-left text-white">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setIsDrawerOpen(true)} className="rounded-full  text-white flex items-center justify-center p-3.5 border border-[#424242] max-sm:hidden relative">
                                            <Image src="/svg-icons/notification.svg" alt="User" width={28} height={28} className="rounded-full" />
                                            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" /> </button>
                                        <Menu.Button className="inline-flex w-full justify-center items-center pr-4 gap-x-1.5 rounded-full  p-0.5 text-sm font-semibold text-white shadow-sm border border-[#424242] hover:bg-gray-800 max-sm:border-none">
                                            {currentUser.image ? <Image src={currentUser.image} alt="User" width={32} height={32} className="rounded-full" /> : <div className="rounded-full bg-[#00122D] text-white flex items-center justify-center p-3"> <LuUser className="w-6 h-6" /> </div>}
                                            <p className="max-sm:hidden">{(currentUser.first_name && currentUser.last_name) ? (currentUser.first_name + " " + currentUser.last_name) : currentUser.email}</p>
                                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-white max-sm:hidden" />
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
                    {/* </Container> */}
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


