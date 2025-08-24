import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  description?: string;
  release_year?: number;
  genre: string;
  poster_url?: string;
  rating?: number;
  duration?: number;
  director?: string;
}

interface CategorySectionProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const CategorySection = ({ title, movies, onMovieClick }: CategorySectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardWidth = 280; // Approximate width of each card
  const maxScroll = Math.max(0, (movies.length * cardWidth) - (window.innerWidth - 100));

  const scrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - cardWidth * 3);
    setScrollPosition(newPosition);
  };

  const scrollRight = () => {
    const newPosition = Math.min(maxScroll, scrollPosition + cardWidth * 3);
    setScrollPosition(newPosition);
  };

  if (!movies.length) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollLeft}
              disabled={scrollPosition === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollRight}
              disabled={scrollPosition >= maxScroll}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex space-x-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-64">
                <MovieCard 
                  movie={movie} 
                  onClick={() => onMovieClick?.(movie)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;