import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";

interface MovieFormData {
  title: string;
  description: string;
  genre: string;
  director: string;
  movie_cast: string;
  release_year: number;
  duration: number;
  poster_url: string;
  trailer_url: string;
  video_url: string;
  download_url: string;
}

interface MovieUploadFormProps {
  onSuccess?: () => void;
  existingMovie?: any;
  isEditing?: boolean;
}

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", 
  "Mystery", "Romance", "Sci-Fi", "Thriller", "Documentary", "Animation"
];

export default function MovieUploadForm({ onSuccess, existingMovie, isEditing = false }: MovieUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MovieFormData>({
    defaultValues: existingMovie ? {
      title: existingMovie.title || "",
      description: existingMovie.description || "",
      genre: existingMovie.genre || "",
      director: existingMovie.director || "",
      movie_cast: Array.isArray(existingMovie.movie_cast) ? existingMovie.movie_cast.join(", ") : (existingMovie.movie_cast || ""),
      release_year: existingMovie.release_year || new Date().getFullYear(),
      duration: existingMovie.duration || 0,
      poster_url: existingMovie.poster_url || "",
      trailer_url: existingMovie.trailer_url || "",
      video_url: existingMovie.video_url || "",
      download_url: existingMovie.download_url || ""
    } : {
      release_year: new Date().getFullYear(),
      duration: 0
    }
  });

  const selectedGenre = watch("genre");

  const onSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);
    try {
      // Convert cast string to array
      const castArray = data.movie_cast.split(",").map(actor => actor.trim()).filter(actor => actor);

      const movieData = {
        ...data,
        movie_cast: castArray,
        status: 'pending'
      };

      let result;
      if (isEditing && existingMovie) {
        result = await supabase
          .from('movies')
          .update(movieData)
          .eq('id', existingMovie.id);
      } else {
        result = await supabase
          .from('movies')
          .insert([movieData]);
      }

      if (result.error) throw result.error;

      toast.success(isEditing ? "Movie updated successfully!" : "Movie uploaded successfully!");
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to save movie: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Movie" : "Upload New Movie"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update movie information" : "Add a new movie to the platform"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter movie title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="genre">Genre *</Label>
                <Select value={selectedGenre} onValueChange={(value) => setValue("genre", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && (
                  <p className="text-sm text-destructive mt-1">{errors.genre.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  {...register("director")}
                  placeholder="Enter director name"
                />
              </div>

              <div>
                <Label htmlFor="movie_cast">Cast</Label>
                <Input
                  id="movie_cast"
                  {...register("movie_cast")}
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate actors with commas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="release_year">Release Year</Label>
                  <Input
                    id="release_year"
                    type="number"
                    {...register("release_year", { 
                      valueAsNumber: true,
                      min: { value: 1900, message: "Year must be after 1900" },
                      max: { value: new Date().getFullYear() + 5, message: "Year cannot be too far in the future" }
                    })}
                    placeholder="2024"
                  />
                  {errors.release_year && (
                    <p className="text-sm text-destructive mt-1">{errors.release_year.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    {...register("duration", { 
                      valueAsNumber: true,
                      min: { value: 1, message: "Duration must be at least 1 minute" }
                    })}
                    placeholder="120"
                  />
                  {errors.duration && (
                    <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter movie description"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="poster_url">Poster URL</Label>
                <Input
                  id="poster_url"
                  {...register("poster_url")}
                  placeholder="https://example.com/poster.jpg"
                />
              </div>

              <div>
                <Label htmlFor="trailer_url">Trailer URL</Label>
                <Input
                  id="trailer_url"
                  {...register("trailer_url")}
                  placeholder="https://example.com/trailer.mp4"
                />
              </div>

              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  {...register("video_url")}
                  placeholder="https://example.com/movie.mp4"
                />
              </div>

              <div>
                <Label htmlFor="download_url">Download URL</Label>
                <Input
                  id="download_url"
                  {...register("download_url")}
                  placeholder="https://example.com/download.mp4"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isSubmitting ? "Saving..." : (isEditing ? "Update Movie" : "Upload Movie")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}