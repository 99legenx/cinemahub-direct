import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [filters, setFilters] = useState<MovieFilters>(defaultFilters);
  
  const { data: allMovies = [], isLoading } = useMovies();

  // Filter and search movies
  const filteredMovies = useMemo(() => {
    let results = allMovies;

    // Apply search query
    if (query.trim()) {
      results = results.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase()) ||
        movie.director?.toLowerCase().includes(query.toLowerCase()) ||
        movie.description?.toLowerCase().includes(query.toLowerCase()) ||
        movie.movie_cast?.some(actor => 
          actor.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

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
  }, [allMovies, query, filters]);

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
          <div className="animate-pulse text-muted-foreground">Loading search results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                {query ? `Search Results for "${query}"` : 'Browse Movies'}
              </h1>
              <p className="text-muted-foreground">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
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

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No movies found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {query 
                  ? `No movies match your search for "${query}". Try adjusting your filters or search terms.`
                  : 'No movies match your current filters. Try adjusting your search criteria.'
                }
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
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

export default SearchResults;