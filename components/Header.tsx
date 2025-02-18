"use client";

import { useUser } from "@clerk/nextjs";

function Header() {
  const { user } = useUser();

  console.log(user);
  return <header>Header</header>;
}

export default Header;
