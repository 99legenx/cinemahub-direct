-- First, populate the categories table with common movie genres
INSERT INTO public.categories (name, slug, description) VALUES
('Action', 'action', 'High-energy films featuring intense sequences, combat, and adventure'),
('Adventure', 'adventure', 'Films featuring exciting journeys and exploration'),
('Comedy', 'comedy', 'Films designed to entertain and amuse audiences'),
('Drama', 'drama', 'Serious films that focus on character development and emotional themes'),
('Fantasy', 'fantasy', 'Films featuring magical or supernatural elements'),
('Horror', 'horror', 'Films designed to frighten, unsettle, and create suspense'),
('Mystery', 'mystery', 'Films involving puzzles, crimes, or unexplained events'),
('Romance', 'romance', 'Films focused on love stories and relationships'),
('Sci-Fi', 'sci-fi', 'Science fiction films featuring futuristic concepts and technology'),
('Thriller', 'thriller', 'Films designed to keep audiences on edge with suspense'),
('Documentary', 'documentary', 'Non-fiction films that document reality'),
('Animation', 'animation', 'Films created using animation techniques'),
('Crime', 'crime', 'Films focused on criminal activities and law enforcement'),
('Family', 'family', 'Films suitable for all ages and family viewing'),
('Musical', 'musical', 'Films featuring songs and musical performances'),
('War', 'war', 'Films set during wartime or focusing on military conflicts'),
('Western', 'western', 'Films set in the American Old West'),
('Biography', 'biography', 'Films based on the lives of real people'),
('History', 'history', 'Films based on historical events or periods'),
('Sport', 'sport', 'Films focused on sports and athletic competition')
ON CONFLICT (slug) DO NOTHING;

-- Allow admins and moderators to manage categories
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Allow admins and moderators to manage movie_categories
CREATE POLICY "Admins can manage movie categories" 
ON public.movie_categories 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Add foreign key constraints to movie_categories
ALTER TABLE public.movie_categories 
ADD CONSTRAINT fk_movie_categories_movie_id 
FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;

ALTER TABLE public.movie_categories 
ADD CONSTRAINT fk_movie_categories_category_id 
FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;