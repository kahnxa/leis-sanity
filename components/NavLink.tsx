"use client";
import Link from "next/link";
import { LinkProps } from "next/link";

interface NavLinkProps {
  href: LinkProps["href"]; // Use Next.js Link's href type
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({
  href,
  children,
  className = "",
}: NavLinkProps) {
  return (
    <Link href={href} className={`relative pb-1 group ${className}`}>
      {children}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
