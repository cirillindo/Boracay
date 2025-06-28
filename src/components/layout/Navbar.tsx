import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { Lock, Menu, X, Heart, CreditCard } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const [isPulsating, setIsPulsating] = useState(false);
  
  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'FOR SALE', href: '/for-sale' },
    { name: 'AIRBNB', href: '/airbnb' },
    { name: 'RENTAL MANAGEMENT', href: '/vacation-rental-management' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CONTACT', href: '/contact' }
  ];

  useEffect(() => {
    const checkFavorites = () => {
      const favoritesStr = localStorage.getItem('favorites');
      const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
      setHasFavorites(favorites.length > 0);
    };

    checkFavorites();

    const handleFavoriteChange = () => {
      checkFavorites();
      setIsPulsating(true);
      setTimeout(() => setIsPulsating(false), 500);
    };

    window.addEventListener('favoritesUpdated', handleFavoriteChange);
    return () => window.removeEventListener('favoritesUpdated', handleFavoriteChange);
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white">
      <Container>
        <div className="flex items-center justify-between h-32">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3" onClick={handleNavClick}>
              <img 
                src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1747138852/logo_Ilaw_ilaw_on7nwc.avif"
                alt="Ilaw Logo"
                className="h-32 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium tracking-wide text-gray-700 hover:text-amber-600 transition-colors"
                onClick={handleNavClick}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/favorites"
              className="text-sm font-medium tracking-wide text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
              onClick={handleNavClick}
            >
              <div className={hasFavorites ? 'heart-radar' : ''}>
                <Heart 
                  className={`w-5 h-5 ${isPulsating ? 'heart-pulse' : ''} ${hasFavorites ? 'fill-red-500 text-red-500' : ''}`}
                />
              </div>
              <span className="sr-only">Favorites</span>
            </Link>
            <Button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/admin/login');
              }}
              variant="outline"
              className="flex items-center gap-2 text-sm"
            >
              <Lock className="w-5 h-5" />
              Admin
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-32 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors py-2"
                  onClick={handleNavClick}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/favorites"
                className="block text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors py-2 flex items-center gap-2"
                onClick={handleNavClick}
              >
                <div className={hasFavorites ? 'heart-radar' : ''}>
                  <Heart 
                    className={`w-5 h-5 ${isPulsating ? 'heart-pulse' : ''} ${hasFavorites ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </div>
                Favorites
              </Link>
              <Button
                onClick={() => {
                  handleNavClick();
                  navigate('/admin/login');
                }}
                variant="outline"
                className="flex items-center gap-2 w-full text-sm"
              >
                <Lock className="w-5 h-5" />
                Admin
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;