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
  const { user, profile, isAdmin, isModerator, signOut, loading } = useAuth();

  // Debug admin status
  console.log('Header - User:', user?.email, 'isAdmin:', isAdmin(), 'isModerator:', isModerator(), 'loading:', loading);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex h-12 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 md:space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Play className="w-3 h-3 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              legendaryMovies
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link to="/" className="text-sm lg:text-base text-foreground hover:text-cinema-gold transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-sm lg:text-base text-muted-foreground hover:text-cinema-gold transition-colors">
              Browse Movies
            </Link>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Search Bar */}
            {!showSearch && (
              <div className="hidden lg:block w-48 xl:w-64">
                <SearchBar />
              </div>
            )}
            
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden text-muted-foreground hover:text-foreground h-8 w-8 md:h-10 md:w-10"
            >
              {showSearch ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Search className="w-4 h-4 md:w-5 md:h-5" />}
            </Button>

            {/* User Account */}
            {user ? (
              <div className="flex items-center space-x-1 md:space-x-2">
                {!loading && (isAdmin() || isModerator()) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      console.log('Admin button clicked, navigating to /admin');
                      navigate('/admin');
                    }}
                    className="hidden sm:flex text-primary hover:text-primary/80 text-xs md:text-sm px-2 md:px-3"
                  >
                    <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Admin
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs md:text-sm px-2 md:px-3">
                      <User className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline max-w-20 md:max-w-none truncate">
                        {profile?.full_name || user.email?.split('@')[0] || 'Account'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!loading && (isAdmin() || isModerator()) && (
                      <>
                        <DropdownMenuItem onClick={() => {
                          console.log('Admin dropdown clicked, navigating to /admin');
                          navigate('/admin');
                        }}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
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
                className="text-muted-foreground hover:text-foreground text-xs md:text-sm px-2 md:px-3"
              >
                <User className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground h-8 w-8"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="lg:hidden px-2 md:px-4 pb-3 md:pb-4">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="container mx-auto px-2 md:px-4 py-3 md:py-4 space-y-3 md:space-y-4">
            <Link to="/" className="block text-sm text-foreground hover:text-cinema-gold transition-colors">
              Home
            </Link>
            <Link to="/browse" className="block text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
              Browse Movies
            </Link>
            {user && !loading && (isAdmin() || isModerator()) && (
              <Link to="/admin" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                Admin Dashboard
              </Link>
            )}
            {!user && (
              <Link to="/auth" className="block text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
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