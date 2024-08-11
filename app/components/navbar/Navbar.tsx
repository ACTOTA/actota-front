'use client';

import Container from "../Container";
import Activities from "../Activities";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";

interface NavbarProps {
    currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
    currentUser
}) => {
    console.log("Navbar currentUser:    ", currentUser);
    return (
        <div className="fixed z-10 w-full bg-none shadow-sm text-white">
            <div
                className="py-3 "
            >
                <Container>
                    <div
                        className="flex flex-row items-center justify-between md:gap-0"
                    >
                        <Logo />
                        <Search />
                        <UserMenu currentUser={currentUser} />
                    </div>
                </Container>
            </div>

        </div>
    );
}

export default Navbar;
