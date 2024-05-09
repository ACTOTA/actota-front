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

const Navbar: React.FC<NavbarProps>  = ({ 
    currentUser 
}) => {
    console.log("Navbar currentUser:    ", currentUser);
    return (
        <div className="fixed z-30 w-full bg-white shadow-sm">  {/* Changed z-10 to z-30 */}
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between md:gap-0">
                        <Logo />
                        <Search />
                        <UserMenu currentUser={currentUser}/>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;