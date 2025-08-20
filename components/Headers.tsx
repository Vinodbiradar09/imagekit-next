"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Upload, Video, LogOut, Menu, X } from "lucide-react";
import { useNotification } from "./Notification";
import { useState, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const { showNotification } = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsMenuOpen(false);
      await signOut({ redirect: true, callbackUrl: "/" });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  if (!isClient || status === "loading") {
    return (
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 text-white font-bold text-xl">
              <div className="bg-white text-black rounded-full p-2">
                <Video className="w-5 h-5" />
              </div>
              Reels Pro
            </div>
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-gray-700 rounded h-8 w-16"></div>
              <div className="animate-pulse bg-gray-700 rounded h-8 w-20"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const isAuthenticated = status === "authenticated" && session;

  return (
    <header
      className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-900"
      suppressHydrationWarning={true}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-3 text-white font-bold text-xl hover:text-gray-300 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="bg-white text-black rounded-full p-2">
              <Video className="w-5 h-5" />
            </div>
            Reels Pro
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/allvideos"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Video className="w-4 h-4" />
              Videos
            </Link>
            {isAuthenticated && (
              <Link
                href="/upload"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 transition-colors duration-300">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline truncate max-w-[150px]">
                    {session.user?.email?.split("@")[0] || "User"}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-4 border-b border-gray-800">
                    <p className="text-white font-medium truncate">
                      {session.user?.email?.split("@")[0]}
                    </p>
                    <p className="text-gray-500 text-sm truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/upload"
                      className="flex items-center gap-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Video
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-900 rounded-lg transition-colors duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/allvideos"
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Video className="w-4 h-4" />
                Videos
              </Link>
              {isAuthenticated && (
                <Link
                  href="/upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>
              )}
              {!isAuthenticated && (
                <div className="border-t border-gray-800 mt-4 pt-4 space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="border-t border-gray-800 mt-4 pt-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-900 rounded-lg transition-colors duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
