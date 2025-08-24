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
      className={`group relative overflow-hidden rounded-lg bg-gradient-card border border-border/50 transition-all duration-300 hover:scale-105 hover:shadow-intense cursor-pointer ${
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                className="flex-1 bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground"
              >
                <Play className="w-3 h-3 mr-1" />
                Watch
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating Badge */}
      {movie.rating && (
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-cinema-gold fill-current" />
          <span className="text-xs font-medium">{movie.rating}</span>
        </div>
      )}
    </div>
  );
};

export default MovieCard;