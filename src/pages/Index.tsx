import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import { useFeaturedMovies, usePopularMovies, useLatestMovies, useMoviesByGenre } from "@/hooks/useMovies";
import type { Movie } from "@/hooks/useMovies";

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: featuredMovies = [] } = useFeaturedMovies();
  const { data: popularMovies = [] } = usePopularMovies();
  const { data: latestMovies = [] } = useLatestMovies();
  const { data: actionMovies = [] } = useMoviesByGenre("Action");
  const { data: sciFiMovies = [] } = useMoviesByGenre("Sci-Fi");

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    // TODO: Navigate to movie details page
    console.log("Selected movie:", movie);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection featuredMovies={featuredMovies} />
        
        <div className="space-y-8">
          <CategorySection 
            title="Popular Movies" 
            movies={popularMovies} 
            onMovieClick={handleMovieClick}
          />
          
          <CategorySection 
            title="Latest Releases" 
            movies={latestMovies} 
            onMovieClick={handleMovieClick}
          />
          
          <CategorySection 
            title="Action Movies" 
            movies={actionMovies} 
            onMovieClick={handleMovieClick}
          />
          
          <CategorySection 
            title="Sci-Fi Movies" 
            movies={sciFiMovies} 
            onMovieClick={handleMovieClick}
          />
        </div>
      </main>
      
      <footer className="mt-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              CinemaHub
            </h3>
            <p className="text-muted-foreground">
              Your premium movie streaming destination. Watch and download movies in HD quality.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
              <span>No subscription required</span>
              <span>HD Quality</span>
              <span>Direct Downloads</span>
              <span>Latest Releases</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
