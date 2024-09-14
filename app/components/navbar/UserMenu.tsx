'use client';

import { useCallback, useState, useRef, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";
import Button from "../figma/Button";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";

interface UserMenuProps {
  currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
  currentUser
}) => {
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();

  const [isOpen, setIsOpen] = useState(false);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [loginModal, rentModal, currentUser]);

  const openMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (!openMenu.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    });

    console.log("UserMenu isOpen:    ", isOpen);
  }, [isOpen]);

  return (
    <div className="flex gap-6 relative" ref={openMenu}>
      <div className="flex flex-row items-center gap-3">
        <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
          onClick={onRent}>
          ACT with US
        </div>
        <div className="p-4 md:py-1 md:px-2 border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
          onClick={() => setIsOpen(!isOpen)}>
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-black overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem label="My Trips" onClick={() => router.push("/trips")} />
                <MenuItem label="My Favorites" onClick={() => router.push("/favorites")} />
                <MenuItem label="My Reservations" onClick={() => router.push("/reservations")} />
                <MenuItem label="ACT with US" onClick={rentModal.onOpen} />
                <MenuItem label="Log Out" onClick={() => signOut()} />
              </>
            ) : (
              <div>
                <button onClick={onRent}>Log In</button>
                <Button className="">Get Started</Button>

              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default UserMenu;
