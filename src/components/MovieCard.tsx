import { Play, Download, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    description?: string;
    release_year?: number;
    genre: string;
    poster_url?: string;
    rating?: number;
    duration?: number;
    director?: string;
  };
  variant?: "default" | "featured";
  onClick?: () => void;
}

const MovieCard = ({ movie, variant = "default", onClick }: MovieCardProps) => {
  const isFeatures = variant === "featured";

  return (
    <div 
      className={`group relative overflow-hidden rounded-xl bg-gradient-surface border border-border/30 transition-all duration-500 hover:scale-[1.03] hover:shadow-intense hover:border-primary/20 cursor-pointer backdrop-blur-sm ${
        isFeatures ? "aspect-[16/9]" : "aspect-[2/3]"
      }`}
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className="relative w-full h-full">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {movie.genre}
              </Badge>
              {movie.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-cinema-gold fill-current" />
                  <span className="text-xs text-cinema-light font-medium">
                    {movie.rating}
                  </span>
                </div>
              )}
            </div>
            
            <h3 className="font-semibold text-cinema-light line-clamp-2">
              {movie.title}
            </h3>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {movie.release_year && <span>{movie.release_year}</span>}
              {movie.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{movie.duration}min</span>
                </div>
              )}
            </div>
            
            {movie.director && (
              <p className="text-xs text-muted-foreground">
                Dir. {movie.director}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                variant="premium"
                className="flex-1"
              >
                <Play className="w-3 h-3 mr-1" />
                Watch
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-accent/50 text-accent hover:bg-accent/20 hover:text-accent hover:border-accent"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating Badge */}
      {movie.rating && (
        <div className="absolute top-3 right-3 bg-gradient-gold backdrop-blur rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-button">
          <Star className="w-3 h-3 text-primary-foreground fill-current" />
          <span className="text-xs font-bold text-primary-foreground">{movie.rating}</span>
        </div>
      )}
    </div>
  );
};

export default MovieCard;