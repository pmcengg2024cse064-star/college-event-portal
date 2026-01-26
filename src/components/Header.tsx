"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Image
                src="/images/pmc-logo.png"
                alt="PMC Tech"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-bold text-sm">PMC TECH</span>
              <span className="text-white/50 text-xs">Inspire to Innovate</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" && !isAdminPage
                  ? "text-orange-400"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Events
            </Link>

            {isAdminPage && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "text-orange-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
            )}

            {!isAdminPage && (
              <Link
                href="/admin/login"
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
