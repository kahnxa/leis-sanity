"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { TrolleyIcon, UserIcon } from "@sanity/icons";
import { ClerkLoaded, SignInButton, useClerk, useUser } from "@clerk/nextjs";

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const dropdownItemClasses =
    "w-full py-1 px-2 text-xs text-center text-black hover:text-[#27aae1] transition-colors duration-200";
  const emailDisplayClasses =
    "w-full py-1 px-2 text-xs text-center text-black cursor-default";

  return (
    <div className="sm:hidden flex flex-col items-center w-full">
      {/* Hamburger Icon (Below Logo) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black hover:text-[#27aae1] transition-colors duration-200 focus:outline-none"
      >
        {isOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Dropdown Menu (Opens Below the Logo) */}
      {isOpen && (
        <nav className="flex flex-col items-center mt-3 space-y-3 bg-white p-4 shadow-lg w-full">
          <Link href="/" className="text-black hover:text-[#27aae1] text-lg">
            home
          </Link>
          <Link
            href="/rules"
            className="text-black hover:text-[#27aae1] text-lg"
          >
            rules
          </Link>
          <Link
            href="/shop"
            className="text-black hover:text-[#27aae1] text-lg"
          >
            shop
          </Link>
          <Link
            href="/contact"
            className="text-black hover:text-[#27aae1] text-lg"
          >
            contact
          </Link>
          <ClerkLoaded>
            {user ? (
              // User Icon and Dropdown
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* User Icon */}
                <div className="cursor-pointer">
                  <UserIcon className="w-6 h-6 hover:text-[#27aae1] transition-colors duration-200" />
                </div>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-auto bg-white border rounded shadow-md flex flex-col">
                    <div className={emailDisplayClasses}>
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-xs font-bold">
                        {user.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                    <Link href="/orders" className={dropdownItemClasses}>
                      My Orders
                    </Link>

                    <button
                      onClick={() => signOut()}
                      className={dropdownItemClasses}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Sign In Button
              <SignInButton mode="modal">
                <div className="flex flex-col items-center cursor-pointer">
                  <UserIcon className="w-6 h-6 hover:text-[#27aae1] transition-colors duration-200" />
                </div>
              </SignInButton>
            )}
          </ClerkLoaded>

          {/* Trolley Icon */}
          <Link href="/cart">
            <span>
              <TrolleyIcon className="w-6 h-6 hover:text-[#27aae1] transition-colors duration-200" />
            </span>
          </Link>
        </nav>
      )}
    </div>
  );
}

export default MobileMenu;
