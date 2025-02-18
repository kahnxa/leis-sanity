"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

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
        </nav>
      )}
    </div>
  );
}

export default MobileMenu;
