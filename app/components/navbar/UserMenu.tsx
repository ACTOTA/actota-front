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
import Link from "next/link";

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
              <div className="flex gap-4">
                <Link href="/signin">
                  <Button className="py-4 font-bold">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-black py-4">Get Started</Button>
                </Link>

              </div>
            )}
          </div>
  );
}

export default UserMenu;
