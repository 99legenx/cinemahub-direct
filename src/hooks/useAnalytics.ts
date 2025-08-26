import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useAnalytics() {
  const { user } = useAuth();

  const trackEvent = async (
    action: 'view' | 'download' | 'stream' | 'search',
    movieId?: string,
    metadata?: any
  ) => {
    try {
      // Get user IP and user agent (in a real app, you'd get these from the request)
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase
        .from('analytics')
        .insert({
          user_id: user?.id,
          movie_id: movieId,
          action,
          metadata,
          user_agent: userAgent,
          // ip_address would be handled by the server in a real implementation
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  };

  const trackMovieView = (movieId: string) => {
    trackEvent('view', movieId);
  };

  const trackMovieDownload = (movieId: string, quality?: string) => {
    trackEvent('download', movieId, { quality });
  };

  const trackMovieStream = (movieId: string, quality?: string) => {
    trackEvent('stream', movieId, { quality });
  };

  const trackSearch = (query: string, resultsCount?: number) => {
    trackEvent('search', undefined, { query, resultsCount });
  };

  return {
    trackMovieView,
    trackMovieDownload,
    trackMovieStream,
    trackSearch
  };
}