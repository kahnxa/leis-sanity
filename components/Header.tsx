"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu"; // Import the mobile menu
import { TrolleyIcon } from "@sanity/icons";
import { UserIcon } from "@sanity/icons";

function Header() {
  const { user } = useUser();

  return (
    <header className="flex flex-col items-center px-6 py-4 bg-white shadow-md w-full">
      {/* Logo (Visible Only on Small Screens) */}
      <Image
        src="/Logo.svg"
        alt="Logo"
        width={140}
        height={70}
        className="sm:hidden mb-2"
      />

      {/* Desktop Navigation (Visible Only on Medium and Larger Screens) */}
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

        {/* Logo (Visible Only on Medium and Larger Screens) */}
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
        {/* Top Right Icons (Trolley and Profile) */}
        <div className="absolute top-0 right-0 m-8 flex items-center gap-4">
          <Link href="/profile">
            <span>
              <UserIcon className="w-6 h-6" />
            </span>
          </Link>
          <Link href="/cart">
            <span>
              <TrolleyIcon className="w-6 h-6" />
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Appears Below Logo on Small Screens) */}
      <MobileMenu />
    </header>
  );
}

export default Header;
