import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Download, Star, Clock, Calendar, User, Users, Film, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMovie, useMoviesByGenre } from "@/hooks/useMovies";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import VideoPlayer from "@/components/VideoPlayer";
import DownloadOptions from "@/components/DownloadOptions";
import { useState } from "react";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  const { data: movie, isLoading, error } = useMovie(id || "");
  const { data: relatedMovies = [] } = useMoviesByGenre(movie?.genre || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Movie not found</h2>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleMovieClick = (selectedMovie: any) => {
    navigate(`/movie/${selectedMovie.id}`);
  };

  const handleWatchMovie = () => {
    setShowPlayer(true);
  };

  const handleDownloadMovie = () => {
    setShowDownloads(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0">
          {movie.poster_url && (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8 items-end">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-card">
                <CardContent className="p-0">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                      <Film className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <ChevronRight className="w-4 h-4" />
                  <span>Movies</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>{movie.genre}</span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-cinema-light">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="secondary" className="bg-gradient-gold text-primary-foreground">
                    {movie.genre}
                  </Badge>
                  {movie.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-cinema-gold fill-current" />
                      <span className="font-medium">{movie.rating}/10</span>
                    </div>
                  )}
                  {movie.release_year && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{movie.release_year}</span>
                    </div>
                  )}
                  {movie.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{movie.duration} min</span>
                    </div>
                  )}
                </div>

                {movie.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    {movie.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={handleWatchMovie}
                    className="bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground shadow-glow"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDownloadMovie}
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
              <TabsTrigger value="streaming">Streaming Info</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold">Movie Information</h3>
                    <div className="space-y-3">
                      {movie.director && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Director:</span>
                          <span className="font-medium">{movie.director}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Film className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Genre:</span>
                        <span className="font-medium">{movie.genre}</span>
                      </div>
                      {movie.release_year && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Release Year:</span>
                          <span className="font-medium">{movie.release_year}</span>
                        </div>
                      )}
                      {movie.duration && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Runtime:</span>
                          <span className="font-medium">{movie.duration} minutes</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {movie.trailer_url && (
                  <Card className="bg-gradient-card border-border/50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="lg"
                          className="bg-background/80 backdrop-blur"
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Play Trailer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cast" className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Cast & Crew</h3>
                  {movie.movie_cast && movie.movie_cast.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {movie.movie_cast.map((actor, index) => (
                        <div key={index} className="text-center space-y-2">
                          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">{actor}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Cast information not available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="streaming" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Quality Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span>HD (720p)</span>
                        <Badge variant="secondary">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span>Full HD (1080p)</span>
                        <Badge variant="secondary">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span>4K Ultra HD</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Language & Subtitles</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>Audio: English, Spanish, French</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>Subtitles: 15+ languages</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">More {movie.genre} Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedMovies.slice(0, 6).map((relatedMovie) => (
                <MovieCard
                  key={relatedMovie.id}
                  movie={relatedMovie}
                  onClick={() => handleMovieClick(relatedMovie)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Player Modal */}
      {showPlayer && (
        <VideoPlayer
          movie={movie}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Download Options Modal */}
      {showDownloads && (
        <DownloadOptions
          movie={movie}
          onClose={() => setShowDownloads(false)}
        />
      )}
    </div>
  );
};

export default MovieDetails;