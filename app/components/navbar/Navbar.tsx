'use client';

import Container from "../Container";
import Activities from "../Activities";
import Logo from "../Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";
import { usePathname } from "next/navigation";

interface NavbarProps {
    currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
    currentUser
}) => {

    const path = usePathname();

    const handleClick = () => {
        if (path !== "/") {
            window.location.href = "/";
        }
    }

    console.log("Navbar currentUser: ", currentUser);
    return (
        <div className="fixed h-28 z-10 w-full bg-none text-white">
            <div className="py-3">
                <Container>
                    <div className="flex flex-row items-center justify-between md:gap-0" >
                        <Logo onClick={handleClick} className="hover:cursor-pointer"/>
                        <UserMenu currentUser={currentUser} />
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;
