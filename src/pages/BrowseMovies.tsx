import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import MovieFiltersComponent, { type MovieFilters } from "@/components/MovieFilters";
import SearchBar from "@/components/SearchBar";
import { useMovies } from "@/hooks/useMovies";
import type { Movie } from "@/hooks/useMovies";

const currentYear = new Date().getFullYear();

const defaultFilters: MovieFilters = {
  genre: 'all',
  releaseYear: [1900, currentYear],
  rating: [0, 10],
  duration: [0, 300],
  quality: [],
  sortBy: 'title',
  sortOrder: 'asc',
};

const BrowseMovies = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<MovieFilters>(defaultFilters);
  
  const { data: allMovies = [], isLoading } = useMovies();

  // Filter movies based on current filters
  const filteredMovies = useMemo(() => {
    let results = allMovies;

    // Apply filters
    if (filters.genre !== 'all') {
      results = results.filter(movie => movie.genre === filters.genre);
    }

    if (filters.releaseYear[0] !== 1900 || filters.releaseYear[1] !== currentYear) {
      results = results.filter(movie => 
        movie.release_year && 
        movie.release_year >= filters.releaseYear[0] && 
        movie.release_year <= filters.releaseYear[1]
      );
    }

    if (filters.rating[0] !== 0 || filters.rating[1] !== 10) {
      results = results.filter(movie => 
        movie.rating && 
        movie.rating >= filters.rating[0] && 
        movie.rating <= filters.rating[1]
      );
    }

    if (filters.duration[0] !== 0 || filters.duration[1] !== 300) {
      results = results.filter(movie => 
        movie.duration && 
        movie.duration >= filters.duration[0] && 
        movie.duration <= filters.duration[1]
      );
    }

    // Sort results
    results.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof Movie];
      let bValue: any = b[filters.sortBy as keyof Movie];

      // Handle null/undefined values
      if (aValue == null) aValue = filters.sortOrder === 'asc' ? '' : 'zzz';
      if (bValue == null) bValue = filters.sortOrder === 'asc' ? '' : 'zzz';

      // Convert to comparable values
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return results;
  }, [allMovies, filters]);

  // Get unique genres for filter dropdown
  const availableGenres = useMemo(() => {
    const genres = new Set(allMovies.map(movie => movie.genre));
    return Array.from(genres).sort();
  }, [allMovies]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading movies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Browse Movies</h1>
              <p className="text-muted-foreground">
                Discover from our collection of {allMovies.length} movies
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <SearchBar />
            </div>

            {/* Filters */}
            <MovieFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              availableGenres={availableGenres}
            />
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {filteredMovies.length} of {allMovies.length} movies
            </p>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <h3 className="text-xl font-semibold">No movies found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No movies match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="text-accent hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseMovies;