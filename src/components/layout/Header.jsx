import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { LockIcon, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center">
          <LockIcon className="w-8 h-8 text-primary mr-2" />
          <span className="font-bold text-xl tracking-tight">SecureAI</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="nav-link">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#security" className="nav-link">Security</a>
          <a href="/contact-sales" className="nav-link">Contact Sales</a>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="hover:bg-secondary" onClick={() => navigate('/login')}>Log In</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/login')}>
                Login
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/signup')}>
                Sign Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/logout')}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass mt-2 mx-4 p-4 rounded-xl">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#security" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Security</a>
            <a href="/contact-sales" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Sales</a>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Button variant="outline" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Log In</Button>
              <Button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>Sign Up</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
