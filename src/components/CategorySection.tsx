import { useState, useRef, useCallback } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const cardWidth = 280; // Approximate width of each card
  const maxScroll = Math.max(0, (movies.length * cardWidth) - (window.innerWidth - 100));

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    scrollStartRef.current = scrollPosition;
  }, [scrollPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startXRef.current - currentX;
    const newPosition = Math.max(0, Math.min(maxScroll, scrollStartRef.current + diff));
    setScrollPosition(newPosition);
  }, [isDragging, maxScroll]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    scrollStartRef.current = scrollPosition;
  }, [scrollPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = startXRef.current - currentX;
    const newPosition = Math.max(0, Math.min(maxScroll, scrollStartRef.current + diff));
    setScrollPosition(newPosition);
  }, [isDragging, maxScroll]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (!movies.length) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="text-sm text-muted-foreground">
            Swipe to navigate
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className={`flex space-x-4 transition-transform ${isDragging ? 'duration-0' : 'duration-300'} ease-out select-none`}
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