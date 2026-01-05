import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 h-fit border-b border-zinc-300 bg-[#F0F8FF] py-2 dark:bg-gray-950">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <p className="hover:-translate-y[2px] rounded-lg border-2 border-r-4 border-b-4 border-black px-2 py-1 text-xl font-bold transition-all hover:bg-blue-200 md:block dark:border-white">
            Quiz Engine
          </p>
        </Link>
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
