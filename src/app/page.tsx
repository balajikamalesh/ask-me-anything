"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  router.push("/dashboard");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader className="animate-spin"/>
    </div>
  );
}
