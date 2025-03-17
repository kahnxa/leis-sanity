"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Package } from "lucide-react";
import useBasketStore from "@/store/store";
import { TrolleyIcon, UserIcon } from "@sanity/icons";
import { ClerkLoaded, SignInButton, useClerk, useUser } from "@clerk/nextjs";
import NavLink from "./NavLink"; // Import the NavLink component

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const dropdownItemClasses =
    "flex items-center justify-center gap-2 w-full py-2 px-4 text-sm text-black hover:bg-gray-50 hover:text-[#27aae1] transition-all duration-200";
  const emailDisplayClasses =
    "w-full py-3 px-4 text-center border-b border-gray-100";
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

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
          <NavLink href="/" className="text-lg">
            home
          </NavLink>
          <NavLink href="/rules" className="text-lg">
            rules
          </NavLink>
          <NavLink href="/shop" className="text-lg">
            shop
          </NavLink>
          <NavLink href="/contact" className="text-lg">
            contact
          </NavLink>

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
                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-6 -top-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden flex flex-col z-50">
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
                  <UserIcon className="w-6 h-6 hover:text-[#27aae1] transition-colors duration-200" />
                </div>
              </SignInButton>
            )}
          </ClerkLoaded>

          {/* Trolley Icon for Mobile Menu with Item Count Badge */}
          <Link href="/basket" className="relative">
            <TrolleyIcon className="w-6 h-6 hover:text-[#27aae1] transition-colors duration-200" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      )}
    </div>
  );
}

export default MobileMenu;
