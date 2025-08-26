import { useState } from "react";
import { Search, Menu, X, Play, Download, User, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { user, profile, isAdmin, isModerator, signOut } = useAuth();

  // Debug admin status
  console.log('Header - User:', user?.email, 'isAdmin:', isAdmin(), 'isModerator:', isModerator());

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              CinemaHub
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-cinema-gold transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-muted-foreground hover:text-cinema-gold transition-colors">
              Browse Movies
            </Link>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search Bar */}
            {!showSearch && (
              <div className="hidden lg:block w-64">
                <SearchBar />
              </div>
            )}
            
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>

            {/* User Account */}
            {user ? (
              <div className="flex items-center space-x-2">
                {(isAdmin() || isModerator()) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/admin')}
                    className="hidden sm:flex text-primary hover:text-primary/80"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        {profile?.full_name || user.email?.split('@')[0] || 'Account'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    {(isAdmin() || isModerator()) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="lg:hidden px-4 pb-4">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link to="/" className="block text-foreground hover:text-cinema-gold transition-colors">
              Home
            </Link>
            <Link to="/browse" className="block text-muted-foreground hover:text-cinema-gold transition-colors">
              Browse Movies
            </Link>
            {user && (isAdmin() || isModerator()) && (
              <Link to="/admin" className="block text-primary hover:text-primary/80 transition-colors">
                Admin Dashboard
              </Link>
            )}
            {!user && (
              <Link to="/auth" className="block text-muted-foreground hover:text-cinema-gold transition-colors">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;