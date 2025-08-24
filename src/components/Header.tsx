import { Search, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              CinemaHub
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search movies..."
              className="pl-10 bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Movies
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Categories
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Latest
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Downloads
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;