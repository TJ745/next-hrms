"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Button>Login</Button>;
  }

  const href = session ? "/profile" : "/auth/login";

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-extrabold mb-6">
          Welcome to <span className="text-blue-600">Better Auth</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          A modern full-stack application with Next.js 15, Tailwind CSS 4,
          PostgreSQL, and better authentication.
        </p>
        <div className="flex gap-4">
          <Button
            asChild
            variant="secondary"
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            style={{ padding: 24, fontSize: 16 }}
          >
            <Link href="/auth/register">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            style={{ padding: 24, borderColor: "#d1d5dc", fontSize: 16 }}
          >
            <Link href={href}>Login</Link>
          </Button>
        </div>
        <div className="mt-4 text-gray-800">
          {session && (
            <p className="flex items-center gap-2">
              <span
                data-role={session.user.role}
                className="size-4 rounded-full animate-pulse data-[role=ADMIN]:bg-red-500 data-[role=USER]:bg-green-500"
              />
              Welcome Back, {session.user.name}! 👋
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
