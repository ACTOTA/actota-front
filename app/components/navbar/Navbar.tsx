'use client';

import Container from "../Container";
import Logo from "../Logo";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/auth";
import { SessionUser } from "@/app/types/session";
import { usePathname } from "next/navigation";

const Navbar = () => {

    const [currentUser, setCurrentUser] = useState<SessionUser | null>(null)
    const [loading, setLoading] = useState(true)
    const path = usePathname();

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUser()
                setCurrentUser(user)
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

    console.log("Navbar currentUser: ", currentUser);
    return (
        <div className="fixed h-28 z-10 w-full bg-none text-white">
            <div className="py-3">
                <Container>
                    <div className="flex flex-row items-center justify-between md:gap-0" >
                        <Logo onClick={handleClick} className="hover:cursor-pointer" />
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;


