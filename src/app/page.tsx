"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader className="animate-spin"/>
    </div>
  );
}
