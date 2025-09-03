import { useState, useEffect } from "react";
import { Play, Download, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Movie {
  id: string;
  title: string;
  description?: string;
  release_year?: number;
  genre: string;
  poster_url?: string;
  rating?: number;
  director?: string;
  movie_cast?: string[];
}

interface HeroSectionProps {
  featuredMovies: Movie[];
}

const HeroSection = ({ featuredMovies }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  if (!featuredMovies.length) {
    return (
      <section className="relative h-[50vh] md:h-[70vh] bg-gradient-hero flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">Welcome to CinemaHub</h2>
          <p className="text-base md:text-xl text-muted-foreground">Your premium movie streaming destination</p>
        </div>
      </section>
    );
  }

  const currentMovie = featuredMovies[currentSlide];

  return (
    <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentMovie.poster_url ? (
          <img 
            src={currentMovie.poster_url} 
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-hero" />
        )}
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/70" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-3 md:space-y-6">
          <div className="space-y-1 md:space-y-2">
            <Badge variant="secondary" className="text-xs md:text-sm">
              {currentMovie.genre}
            </Badge>
            <h1 className="text-2xl md:text-5xl font-bold text-foreground leading-tight">
              {currentMovie.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-muted-foreground">
            {currentMovie.release_year && <span>{currentMovie.release_year}</span>}
            {currentMovie.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-cinema-gold">★</span>
                <span>{currentMovie.rating}/10</span>
              </div>
            )}
            {currentMovie.director && <span className="hidden md:inline">Dir. {currentMovie.director}</span>}
          </div>
          
          {currentMovie.description && (
            <p className="text-sm md:text-lg text-foreground/90 leading-relaxed line-clamp-2 md:line-clamp-3">
              {currentMovie.description}
            </p>
          )}
          
          {currentMovie.movie_cast && currentMovie.movie_cast.length > 0 && (
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground mb-1">Starring:</p>
              <p className="text-foreground">
                {currentMovie.movie_cast.slice(0, 3).join(", ")}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Button 
              size="sm" 
              className="bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground px-4 md:px-8 md:size-lg"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Watch Now
            </Button>
            <div className="flex space-x-2 md:space-x-4">
              <Button 
                size="sm" 
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-4 md:px-8 md:size-lg flex-1 md:flex-none"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden md:inline">Download</span>
                <span className="md:hidden">DL</span>
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-foreground hover:text-primary px-4 md:px-8 md:size-lg flex-1 md:flex-none"
              >
                <Info className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden md:inline">More Info</span>
                <span className="md:hidden">Info</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/20 hover:bg-background/40 text-foreground"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/20 hover:bg-background/40 text-foreground"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Slide Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-8" : "bg-foreground/30"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;