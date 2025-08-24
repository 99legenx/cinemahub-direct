-- Create movies table
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  release_year INTEGER,
  genre TEXT NOT NULL,
  poster_url TEXT,
  trailer_url TEXT,
  video_url TEXT,
  download_url TEXT,
  duration INTEGER, -- in minutes
  rating DECIMAL(3,1), -- e.g., 8.5
  director TEXT,
  movie_cast TEXT[], -- array of cast member names
  featured BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  latest BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table for better organization
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create movie_categories junction table
CREATE TABLE public.movie_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(movie_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no login required)
CREATE POLICY "Movies are viewable by everyone" 
ON public.movies 
FOR SELECT 
USING (true);

CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Movie categories are viewable by everyone" 
ON public.movie_categories 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON public.movies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Action', 'action', 'High-octane action and adventure films'),
  ('Comedy', 'comedy', 'Hilarious comedies and feel-good movies'),
  ('Drama', 'drama', 'Compelling dramatic narratives'),
  ('Sci-Fi', 'sci-fi', 'Science fiction and futuristic stories'),
  ('Horror', 'horror', 'Spine-chilling horror and thriller films'),
  ('Romance', 'romance', 'Romantic and heartwarming stories'),
  ('Animation', 'animation', 'Animated films for all ages'),
  ('Documentary', 'documentary', 'Real-life documentaries and non-fiction');

-- Create storage bucket for movie assets
INSERT INTO storage.buckets (id, name, public) VALUES ('movie-assets', 'movie-assets', true);

-- Create storage policies for movie assets
CREATE POLICY "Movie assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'movie-assets');

-- Insert some sample movies for demonstration
INSERT INTO public.movies (title, description, release_year, genre, poster_url, rating, director, movie_cast, featured, popular, latest) VALUES
  ('The Matrix', 'A computer programmer discovers that reality as he knows it is a simulation controlled by machines.', 1999, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 8.7, 'The Wachowskis', ARRAY['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'], true, true, false),
  ('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 2010, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 8.8, 'Christopher Nolan', ARRAY['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'], true, true, false),
  ('The Dark Knight', 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.', 2008, 'Action', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0, 'Christopher Nolan', ARRAY['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'], false, true, false),
  ('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 2014, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 8.6, 'Christopher Nolan', ARRAY['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'], false, false, true),
  ('Avatar', 'A paraplegic Marine dispatched to the moon Pandora joins a unique program and becomes torn between following orders and protecting the world.', 2009, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg', 7.8, 'James Cameron', ARRAY['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'], false, false, true);