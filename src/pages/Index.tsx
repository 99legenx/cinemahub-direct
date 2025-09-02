import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import { useFeaturedMovies, usePopularMovies, useLatestMovies, useMoviesByGenre } from "@/hooks/useMovies";
import type { Movie } from "@/hooks/useMovies";

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();
  
  const { data: featuredMovies = [] } = useFeaturedMovies();
  const { data: popularMovies = [] } = usePopularMovies();
  const { data: latestMovies = [] } = useLatestMovies();
  const { data: actionMovies = [] } = useMoviesByGenre("Action");
  const { data: sciFiMovies = [] } = useMoviesByGenre("Sci-Fi");

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main>
        <HeroSection featuredMovies={featuredMovies} />
        
        <div className="space-y-12 py-8">
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
      
      <footer className="mt-16 bg-gradient-surface border-t border-border/30 backdrop-blur">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              CinemaHub
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your premium movie streaming destination. Watch and download movies in HD quality with no subscription required.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-surface/50 rounded-lg p-3 border border-border/20">
                <span className="text-sm font-medium text-primary">No Subscription</span>
              </div>
              <div className="bg-gradient-surface/50 rounded-lg p-3 border border-border/20">
                <span className="text-sm font-medium text-primary">HD Quality</span>
              </div>
              <div className="bg-gradient-surface/50 rounded-lg p-3 border border-border/20">
                <span className="text-sm font-medium text-primary">Direct Downloads</span>
              </div>
              <div className="bg-gradient-surface/50 rounded-lg p-3 border border-border/20">
                <span className="text-sm font-medium text-primary">Latest Releases</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
