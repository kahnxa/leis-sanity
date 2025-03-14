"use client";

import { ClerkLoaded, SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { TrolleyIcon, UserIcon } from "@sanity/icons";
import useBasketStore from "@/store/store";

function Header() {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const dropdownItemClasses =
    "w-full py-1 px-2 text-xs text-center text-black hover:text-[#27aae1] transition-colors duration-200";
  const emailDisplayClasses =
    "w-full py-1 px-2 text-xs text-center text-black cursor-default";

  return (
    <header className="relative flex flex-col items-center px-6 py-4 bg-white shadow-md w-full">
      {/* Desktop Navigation */}
      <div className="hidden sm:flex justify-center items-center w-full">
        {/* Left Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-black">
          <Link
            href="/"
            className="hover:text-[#27aae1] transition-colors duration-200"
          >
            home
          </Link>
          <Link
            href="/rules"
            className="hover:text-[#27aae1] transition-colors duration-200"
          >
            rules
          </Link>
        </nav>

        {/* Logo */}
        <Image
          src="/lowerCase_logo.svg"
          alt="Logo"
          width={140}
          height={70}
          className="mx-10 sm:block"
        />

        {/* Right Navigation Links */}
        <nav className="flex items-center gap-4 text-sm font-medium text-black">
          <Link
            href="/shop"
            className="hover:text-[#27aae1] transition-colors duration-200"
          >
            shop
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#27aae1] transition-colors duration-200"
          >
            contact
          </Link>
        </nav>
      </div>

      {/* Mobile Logo */}
      <Image
        src="/lowerCase_logo.svg"
        alt="Logo"
        width={140}
        height={70}
        className="sm:hidden mb-2"
      />

      {/* Top Right Icons */}
      <div className="hidden sm:flex absolute top-0 right-0 m-8 items-center gap-4">
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
                <div className="absolute right-0 w-auto bg-white border rounded shadow-md flex flex-col">
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

        {/* Trolley Icon with Item Count Badge */}
        <Link href="/basket" className="relative">
          <TrolleyIcon className="w-6 h-6 hover:text-[#27aae1] transition-colors duration-200" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#27aae1] text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </header>
  );
}

export default Header;
