import { Search, X, Film, Clock, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "@/hooks/useMovies";
import type { Movie } from "@/hooks/useMovies";

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

const SearchBar = ({ onClose, className }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const navigate = useNavigate();
  const { data: movies = [] } = useMovies();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter movies based on search query
  useEffect(() => {
    if (query.trim() && movies.length > 0) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase()) ||
        movie.director?.toLowerCase().includes(query.toLowerCase()) ||
        movie.movie_cast?.some(actor => 
          actor.toLowerCase().includes(query.toLowerCase())
        )
      ).slice(0, 6); // Limit to 6 suggestions
      
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, movies]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search movies, actors, directors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 bg-background/80 backdrop-blur border-border/50 focus:border-accent transition-colors"
            autoFocus
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-lg shadow-card backdrop-blur z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-3 py-2 border-b border-border/50">
              Search Results
            </div>
            {suggestions.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-16 bg-muted rounded overflow-hidden">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left space-y-1">
                  <h4 className="font-medium text-sm line-clamp-1">{movie.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{movie.genre}</span>
                    {movie.release_year && (
                      <>
                        <span>•</span>
                        <span>{movie.release_year}</span>
                      </>
                    )}
                    {movie.duration && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{movie.duration}min</span>
                        </div>
                      </>
                    )}
                  </div>
                  {movie.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-cinema-gold fill-current" />
                      <span className="text-xs font-medium">{movie.rating}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
            
            {query.trim() && (
              <button
                onClick={handleSearch}
                className="w-full flex items-center space-x-2 px-3 py-3 hover:bg-muted rounded-lg transition-colors border-t border-border/50 mt-2 pt-3"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Search for "{query}"</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;