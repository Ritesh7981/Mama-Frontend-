"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUserRole(parsedUser?.role);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg border-b border-purple-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-xl bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Phone Gallery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-purple-800/30">
                Home
              </Link>
              {userRole === "admin" && (
                <Link href="/addPhone" className="text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-purple-800/30">
                  ADD Phones
                </Link>
              )}
              
              <Link href="/needToBuy" className="text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-purple-800/30">
                Need to Buy
              </Link>
              <Link href="/sellouts" className="text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-purple-800/30">
                Sellouts
              </Link>
             
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
          

            {/* Cart */}
           

            {/* User Account / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-purple-200 hover:text-white hover:bg-purple-800/30 rounded-lg transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name || user?.email || 'User'}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center space-x-1 p-2 text-purple-200 hover:text-white hover:bg-purple-800/30 rounded-lg transition-colors duration-200">
                <LogIn className="h-5 w-5" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}

            {/* CTA Button */}
            <Link href="/sellouts" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              Sell Phone
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-purple-200 hover:text-white hover:bg-purple-800/30 p-2 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-purple-800/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search phones..."
                  className="w-full bg-slate-800/50 border border-purple-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <Link href="/" className="text-purple-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-800/30 transition-colors duration-200">
              Home
            </Link>
            {mounted && userRole === "admin" && (
              <Link href="/addPhone" className="text-purple-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-800/30 transition-colors duration-200">
                ADD Phones
              </Link>
            )}
            <Link href="/needToBuy" className="text-purple-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-800/30 transition-colors duration-200">
              Need to Buy
            </Link>
            <Link href="/sellouts" className="text-purple-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-800/30 transition-colors duration-200">
              Sellouts
            </Link>

            {/* Mobile Actions */}
            <div className="border-t border-purple-800/30 pt-4 px-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-purple-200 hover:text-white hover:bg-purple-800/30 rounded-lg transition-colors duration-200">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>
                <Link href="/sell" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm">
                  Sell Phone
                </Link>
              </div>
              
              {/* Mobile User Actions */}
              {isAuthenticated ? (
                <div className="border-t border-purple-800/30 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-purple-300" />
                      <span className="text-purple-200 text-sm">{user?.name || user?.email || 'User'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-purple-800/30 pt-4">
                  <Link href="/login" className="flex items-center justify-center space-x-2 w-full p-2 text-purple-200 hover:text-white hover:bg-purple-800/30 rounded-lg transition-colors duration-200">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;