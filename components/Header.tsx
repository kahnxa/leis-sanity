"use client";

import { ClerkLoaded, SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { TrolleyIcon, UserIcon } from "@sanity/icons";
import { Package } from "lucide-react";
import useBasketStore from "@/store/store";
import NavLink from "./NavLink"; // Import the NavLink component

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
    "flex items-center justify-center gap-2 w-full py-2 px-4 text-sm text-black hover:bg-gray-50 hover:text-[#27aae1] transition-all duration-200";
  const emailDisplayClasses =
    "w-full py-3 px-4 text-center border-b border-gray-100";

  return (
    <header className="relative flex flex-col items-center px-6 py-4 bg-white shadow-md w-full">
      {/* Desktop Navigation */}
      <div className="hidden sm:flex justify-center items-center w-full">
        {/* Left Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-black">
          <NavLink href="/">home</NavLink>
          <NavLink href="/rules">rules</NavLink>
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
          <NavLink href="/shop">shop</NavLink>
          <NavLink href="/contact">contact</NavLink>
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
                <UserIcon className="w-7 h-7 hover:text-[#27aae1] transition-colors duration-200" />
              </div>
              {/* Enhanced Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden flex flex-col z-50">
                  <div className={emailDisplayClasses}>
                    <p className="text-xs text-gray-400 mb-1">Signed in as</p>
                    <p className="text-sm font-semibold truncate">
                      {user.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>

                  <Link href="/orders" className={dropdownItemClasses}>
                    <Package size={16} />
                    <span>My Orders</span>
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className={`${dropdownItemClasses} border-t border-gray-100 text-red-500 hover:text-red-600 hover:bg-red-50 mt-1`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Sign In Button
            <SignInButton mode="modal">
              <div className="flex flex-col items-center cursor-pointer">
                <UserIcon className="w-7 h-7 hover:text-[#27aae1] transition-colors duration-200" />
              </div>
            </SignInButton>
          )}
        </ClerkLoaded>

        {/* Trolley Icon with Item Count Badge */}
        <Link
          href="/basket"
          className="relative flex items-center justify-center"
        >
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
