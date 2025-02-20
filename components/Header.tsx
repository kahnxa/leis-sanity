"use client";

import { ClerkLoaded, SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { PackageIcon, TrolleyIcon, UserIcon } from "@sanity/icons";

function Header() {
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
          src="/Logo.svg"
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
        src="/Logo.svg"
        alt="Logo"
        width={140}
        height={70}
        className="sm:hidden mb-2"
      />

      {/* Top Right Icons */}
      <div className="hidden sm:flex absolute top-0 right-0 m-8 flex items-center gap-4">
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

        {/* Trolley Icon */}
        <Link href="/cart">
          <span>
            <TrolleyIcon className="w-6 h-6 hover:text-[#27aae1] transition-colors duration-200" />
          </span>
        </Link>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </header>
  );
}

export default Header;
