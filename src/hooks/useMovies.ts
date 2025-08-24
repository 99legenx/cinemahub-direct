import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Movie {
  id: string;
  title: string;
  description?: string;
  release_year?: number;
  genre: string;
  poster_url?: string;
  trailer_url?: string;
  video_url?: string;
  download_url?: string;
  duration?: number;
  rating?: number;
  director?: string;
  movie_cast?: string[];
  featured?: boolean;
  popular?: boolean;
  latest?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: ["featured-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const usePopularMovies = () => {
  return useQuery({
    queryKey: ["popular-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("popular", true)
        .order("rating", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useLatestMovies = () => {
  return useQuery({
    queryKey: ["latest-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("latest", true)
        .order("release_year", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useMoviesByGenre = (genre: string) => {
  return useQuery({
    queryKey: ["movies-by-genre", genre],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("genre", genre)
        .order("rating", { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as Movie[];
    },
    enabled: !!genre,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Movie;
    },
    enabled: !!id,
  });
};