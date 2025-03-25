"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

const Footer = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="py-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm mt-24">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/">
            <div className="w-[120px] aspect-[96/40] relative">
              <Image
                src="/Logo_No_Brackets.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority={true}
              />
            </div>
          </Link>
          <p>5629 N Lamar Blvd, Apt 221, Austin, TX 78751, United States</p>
          <div className="flex gap-6">
            <Link
              href="https://www.instagram.com/playleis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </Link>
          </div>
        </div>
        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col gap-8">
            <h1 className="font-medium text-lg">COMPANY</h1>
            <div className="flex flex-col gap-6">
              <Link href="/rules">Rules</Link>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h1 className="font-medium text-lg">SHOP</h1>
            <div className="flex flex-col gap-6">
              <Link href="">Products</Link>
              {isSignedIn ? (
                <Link href="/orders">My Orders</Link>
              ) : (
                <SignInButton mode="modal">
                  <span className="cursor-pointer">Orders</span>
                </SignInButton>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h1 className="font-medium text-lg">HELP</h1>
            <div className="flex flex-col gap-6">
              <Link href="/contact">Contact Us</Link>
              <Link href="/returns">Return Policy</Link>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <h1 className="font-medium text-lg">SECURE PAYMENTS</h1>
          <div className="flex justify-between">
            <Image src="/discover.svg" alt="Discover" width={40} height={20} />
            <Image
              src="/mastercard.svg"
              alt="Mastercard"
              width={40}
              height={20}
            />
            <Image src="/visa.svg" alt="Visa" width={40} height={20} />
            <Image src="/amex.svg" alt="Amex" width={40} height={20} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
        <div className="">© 2025 Leis Shop</div>
        <div className="">
          <div className="">
            <span className="text-gray-500 mr-4">Language</span>
            <span className="font-medium">United States | English</span>
          </div>
          <div className="">
            <span className="text-gray-500 mr-4">Currency</span>
            <span className="font-medium">$ USD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
