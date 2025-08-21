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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsMenuOpen(false);
      await signOut({ 
        redirect: true, 
        callbackUrl: "/",
      });
      showNotification("Signed out successfully", "success");
    } catch (error) {
      console.error("Sign out error:", error);
      showNotification("Failed to sign out", "error");
    }
  };

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
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
              <div className="animate-pulse bg-gray-700 rounded h-8 w-20"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const isAuthenticated = status === "authenticated" && session?.user;
  const username = session?.user?.email ? session.user.email.split("@")[0] : "";

  return (
    <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl hover:text-gray-300">
            <div className="bg-white text-black rounded-full p-2">
              <Video className="w-5 h-5" />
            </div>
            Reels Pro
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/allvideos" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <Video className="w-4 h-4" />
              Videos
            </Link>
            {isAuthenticated && (
              <Link href="/upload" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity duration-300">
                <Upload className="w-4 h-4" />
                Upload
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-3 py-2 border border-gray-700 hover:border-gray-600 transition-colors duration-300">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline truncate max-w-[150px]">{username}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 bg-black border border-gray-800 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 min-w-[200px]">
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-white font-semibold truncate">{username}</p>
                    <p className="text-gray-400 truncate text-sm">{session?.user?.email ?? ""}</p>
                  </div>
                  <div className="py-2">
                    <Link 
                      href="/upload" 
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-white transition-colors duration-300"
                    >
                      <Upload className="inline w-4 h-4 mr-2" />
                      Upload Video
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-900 transition-colors duration-300"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-black border-t border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="/" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="inline w-4 h-4 mr-2" />
                Home
              </Link>
              <Link 
                href="/allvideos" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Video className="inline w-4 h-4 mr-2" />
                Videos
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/upload" 
                  className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Upload className="inline w-4 h-4 mr-2" />
                  Upload
                </Link>
              )}
              {!isAuthenticated ? (
                <>
                  <Link 
                    href="/login" 
                    className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-red-500 hover:text-red-400 transition-colors duration-300 py-2"
                >
                  <LogOut className="inline w-4 h-4 mr-2" />
                  Sign Out
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}