'use client';

import Container from "../Container";
import Logo from "../Logo";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "../figma/Button";
import Link from "next/link";
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from "next/image";
import { LuUser } from "react-icons/lu";
import DrawerModal from "../DrawerModal";
import NotificationsDrawer from "./NotificationsDrawer";
import { STEPS } from "@/src/types/steps";
import Search from "./Search";
import { useLogout } from "@/src/hooks/mutations/auth.mutation";
import { useRouter } from "next/navigation";
import { LoadScript } from "@react-google-maps/api";
import { getAuthCookie, isTokenExpired, signOut } from "@/src/helpers/auth";
import { getLocalStorageItem, removeLocalStorageItem } from "@/src/utils/browserStorage";

const Navbar = () => {
    const user = JSON.parse(getLocalStorageItem('user') || '{}');
    const router = useRouter();
    const pathname = usePathname();
    const isAuthRoute = pathname?.startsWith('/auth');
    const isHomePage = pathname === '/';
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [currStep, setCurrStep] = useState<STEPS | null>(null);
    const [classes, setClasses] = useState<string>('');
    const [loading, setLoading] = useState(true)
    const path = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 0
    );

    // Track screen width for responsive design
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        if (typeof window !== 'undefined') {
            setScreenWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    // Determine if we're on a small screen
    const isSmallScreen = screenWidth < 1100 && window.location.pathname !== ""; // Adjust breakpoint as needed

    const handleClick = () => {
        if (path !== "/") {
            window.location.href = "/";
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getAuthCookie();
            
            try {
                // Check if token exists and is not expired
                const isExpired = token ? await isTokenExpired(token) : true;
                
                if (token && !isExpired) {
                    const storedUser = getLocalStorageItem('user');
                    
                    if (storedUser) {
                        // User data exists in localStorage
                        const user = JSON.parse(storedUser);
                        setCurrentUser(user);
                    } else {
                        // We have a valid token but no localStorage data - fetch from session
                        try {
                            const response = await fetch('/api/auth/session');
                            const sessionData = await response.json();
                            
                            if (sessionData.success && sessionData.data) {
                                const userData = sessionData.data;
                                
                                // Store user data in localStorage
                                const userDataToStore = {
                                    user_id: userData._id?.$oid || userData.user_id,
                                    first_name: userData.first_name,
                                    last_name: userData.last_name,
                                    email: userData.email,
                                    customer_id: userData.customer_id,
                                    role: userData.role || 'user'
                                };
                                
                                localStorage.setItem('user', JSON.stringify(userDataToStore));
                                setCurrentUser(userDataToStore);
                            }
                        } catch (error) {
                            console.error('Error fetching session data:', error);
                            setCurrentUser(null);
                        }
                    }
                } else if (token && isExpired) {
                    // Token exists but is expired - handle logout
                    await signOut();
                    removeLocalStorageItem('user');
                    removeLocalStorageItem('token');
                    setCurrentUser(null);
                    
                    // Redirect to login if not already there
                    if (!pathname?.includes('/auth/signin')) {
                        router.push('/auth/signin?expired=true');
                    }
                } else {
                    // No token
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setCurrentUser(null);
            } finally {
                // Set loading to false after authentication check
                setLoading(false);
            }
        };
        
        checkAuth();
    }, [pathname, router]);

    async function handleSignout() {
        signOut();
        const { removeLocalStorageItem } = require('@/src/utils/browserStorage');
        removeLocalStorageItem('user');
        window.location.href = '/auth/signin';
        setCurrentUser(null);
    }

    return (
        <div>
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}
                libraries={['places', 'drawing', 'visualization', 'marker']}
                language="en"
                region="EN"
                version="weekly">
                <div className={`fixed h-[78px] z-30 w-full bg-black/70 backdrop-blur-sm text-white items-center ${isAuthRoute ? 'hidden' : ''} ${isHomePage ? 'flex' : 'hidden sm:flex'}`}>
                    <div className="py-2 w-full h-full px-4" >
                        <div className="flex flex-row items-start justify-between w-full h-full" >
                            <Logo onClick={handleClick} className="hover:cursor-pointer z-50 my-auto" />


                            {currentUser ? (
                                <div className="mt-1">
                                    <Menu as="div" className="relative inline-block text-left text-white">
                                        <div className="flex items-center gap-2">
                                            {/* On mobile home page, show only notification button */}
                                            {isHomePage && isSmallScreen ? (
                                                <button
                                                    onClick={() => setIsNotificationDrawerOpen(true)}
                                                    className="rounded-full text-white flex items-center justify-center p-3.5 border border-[#424242] relative"
                                                >
                                                    <Image src="/svg-icons/notification.svg" alt="Notifications" width={28} height={28} className="rounded-full" />
                                                    <div className="absolute bg-red-500 rounded-full" />
                                                </button>
                                            ) : (
                                                <>
                                                    {/* Show notification button on larger screens */}
                                                    {!isSmallScreen && (
                                                        <button
                                                            onClick={() => setIsNotificationDrawerOpen(true)}
                                                            className="rounded-full text-white flex items-center justify-center p-3.5 border border-[#424242] relative"
                                                        >
                                                            <Image src="/svg-icons/notification.svg" alt="Notifications" width={28} height={28} className="rounded-full" />
                                                            <div className="absolute bg-red-500 rounded-full" />
                                                        </button>
                                                    )}

                                                    <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-full p-0.5 text-sm font-semibold text-white shadow-sm border border-[#424242] sm:hover:bg-gray-800 max-sm:border-none">
                                                        {currentUser.image ?
                                                            <Image src={currentUser.image} alt="User" width={32} height={32} className="rounded-full" /> :
                                                            <div className="rounded-full bg-[#00122D] text-white flex items-center justify-center p-3">
                                                                <LuUser className="w-6 h-6" />
                                                            </div>
                                                        }
                                                        {!isSmallScreen && (
                                                            <>
                                                                <p>{(currentUser.first_name && currentUser.last_name) ?
                                                                    (currentUser.first_name + " " + currentUser.last_name) :
                                                                    currentUser.email}
                                                                </p>
                                                                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-white" />
                                                            </>
                                                        )}
                                                    </Menu.Button>
                                                </>
                                            )}
                                        </div>

                                        {/* Hide menu items on mobile home page since we only show notifications */}
                                        {!(isHomePage && isSmallScreen) && (
                                            <Menu.Items
                                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-black/90 border border-white/20 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                            >
                                            {/* Show user name at top for small screens */}
                                            {isSmallScreen && (
                                                <div className="px-4 py-3 border-b border-white/10">
                                                    <p className="text-sm font-medium">
                                                        {(currentUser.first_name && currentUser.last_name) ?
                                                            (currentUser.first_name + " " + currentUser.last_name) :
                                                            currentUser.email}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Show notifications option on small screens */}
                                            {isSmallScreen && (
                                                <div className="">
                                                    <Menu.Item>
                                                        <button
                                                            onClick={() => {
                                                                setIsNotificationDrawerOpen(true);
                                                                // Optional: close the menu when opening notifications
                                                                document.body.click();
                                                            }}
                                                            className="w-full text-left px-4 py-2 pt-3 text-sm hover:bg-red-500/20 hover:rounded-t-md flex items-center"
                                                        >
                                                            <Image src="/svg-icons/notification.svg" alt="Notifications" width={20} height={20} className="mr-2" />
                                                            Notifications
                                                            <div className="ml-2 w-2 h-2 bg-red-500 rounded-full" />
                                                        </button>
                                                    </Menu.Item>
                                                </div>
                                            )}

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
                                                    hover:bg-red-500/20 hover:rounded-b-md cursor-pointer" onClick={handleSignout}>
                                                        Sign Out
                                                    </div>
                                                </Menu.Item>
                                            </div>
                                            </Menu.Items>
                                        )}
                                    </Menu>
                                </div>
                            ) : (
                                <div className="flex gap-2 z-50">
                                    <Link href='/auth/signin'><Button variant="simple" className="hover:cursor-pointer text-white">Log In</Button></Link>
                                    <Link href='/auth/signup'><Button variant="primary" className="hover:cursor-pointer bg-white text-black">Get Started</Button></Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notification drawer */}
                <DrawerModal
                    isDrawerOpen={isNotificationDrawerOpen}
                    setIsDrawerOpen={setIsNotificationDrawerOpen}
                >
                    <NotificationsDrawer setIsDrawerOpen={setIsNotificationDrawerOpen} />
                </DrawerModal>
            </LoadScript>
        </div>
    );
}

export default Navbar;
