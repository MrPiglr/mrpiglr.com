
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, LogOut, Menu, X, Users, ShoppingCart as ShoppingCartIcon, Briefcase, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSite } from '@/contexts/SiteContext';
import { useCart } from '@/hooks/useCart';
import ShoppingCart from '@/components/ShoppingCart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { logoUrl } = useSite();
  const { cartItems } = useCart();
  const location = useLocation();

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const mobileMenuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      opacity: 0,
      y: "-20px",
      transition: { duration: 0.2 }
    }
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logoUrl || '/favicon.svg'} alt="Site Logo" className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block text-white">MrPiglr</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link to="/store">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5"><Store className="mr-2 h-4 w-4" />Store</Button>
            </Link>
            <Link to="/services">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5"><Briefcase className="mr-2 h-4 w-4" />Services</Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">Portfolio</Button>
            </Link>
            <Link to="/events">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">Events</Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/members">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                    <Users className="mr-2 h-4 w-4" />
                    Members
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-purple-900 text-[10px] text-white">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">{profile?.username || user.email?.split('@')[0]}</span>
                  </Button>
                </Link>
                <Button 
                  onClick={signOut} 
                  variant="ghost"
                  className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
            
            <Button onClick={() => setIsCartOpen(true)} variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-white/5">
                <ShoppingCartIcon className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shadow-sm">
                    {totalCartItems}
                  </span>
                )}
            </Button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
             <Button onClick={() => setIsCartOpen(true)} variant="ghost" size="icon" className="relative text-gray-300">
                <ShoppingCartIcon className="h-6 w-6" />
                 {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="text-gray-300">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute left-0 w-full border-b border-white/10 bg-black/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col space-y-1 p-4">
                 <Link to="/store">
                    <Button variant="ghost" className="w-full justify-start text-gray-300"><Store className="mr-2 h-4 w-4" />Store</Button>
                  </Link>
                  <Link to="/services">
                    <Button variant="ghost" className="w-full justify-start text-gray-300"><Briefcase className="mr-2 h-4 w-4" />Services</Button>
                  </Link>
                  <Link to="/portfolio">
                    <Button variant="ghost" className="w-full justify-start text-gray-300">Portfolio</Button>
                  </Link>
                  <Link to="/events">
                    <Button variant="ghost" className="w-full justify-start text-gray-300">Events</Button>
                  </Link>
                {user ? (
                  <>
                    <Link to="/members">
                      <Button variant="ghost" className="w-full justify-start text-gray-300">
                        <Users className="mr-2 h-4 w-4" />
                        Members
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="w-full justify-start text-gray-300">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <div className="px-4 py-2 text-sm text-gray-400">
                      Logged in as {user.email}
                    </div>
                    <Button onClick={signOut} variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button className="w-full justify-start bg-purple-600 text-white hover:bg-purple-700">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;
