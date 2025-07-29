import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Search, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';
import LocationSelector from './LocationSelector';
import AddressDisplay from './AddressDisplay';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoggedIn } = useUser();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/' 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] bg-clip-text text-transparent">
            FoodCompare
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center text-gray-700 hover:text-gray-900 transition"
          >
            <MapPin size={18} className="mr-1" />
            {/* <span>{user?.location?.name || 'Set location'}</span> */}
            <AddressDisplay
              address={user?.location?.name || "Set location"}
              maxLength={30}
            />
          </button>
          
          <Link 
            to="/search" 
            className="flex items-center text-gray-700 hover:text-gray-900 transition"
          >
            <Search size={18} className="mr-1" />
            <span>Search</span>
          </Link>
          
          {isLoggedIn ? (
            <Link 
              to="/account" 
              className="flex items-center text-gray-700 hover:text-gray-900 transition"
            >
              <User size={18} className="mr-1" />
              <span>Account</span>
            </Link>
          ) : (
            <button 
              className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white py-2 px-4 rounded-full hover:shadow-md transition"
            >
              Sign In
            </button>
          )}
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => {
                setLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center text-gray-700 py-2"
            >
              <MapPin size={18} className="mr-2" />
              {/* {user?.location?.name || 'Set location'} */}
              <AddressDisplay
                address={user?.location?.name || "Set location"}
                maxLength={30}
              />
            </button>
            
            <Link 
              to="/search" 
              className="flex items-center text-gray-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={18} className="mr-2" />
              Search
            </Link>
            
            {isLoggedIn ? (
              <Link 
                to="/account" 
                className="flex items-center text-gray-700 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} className="mr-2" />
                Account
              </Link>
            ) : (
              <button 
                className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white py-2 px-4 rounded-full w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {locationModalOpen && (
        <LocationSelector
          onClose={() => setLocationModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;