import { useState, useEffect } from "react";
console.log('AdminDashboard component imported and loading...');
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Film, 
  Users, 
  BarChart3, 
  Shield, 
  Upload, 
  Check, 
  X, 
  Eye,
  Download,
  Play,
  Search,
  Edit2,
  Trash2,
  Loader2
} from "lucide-react";
import MovieUploadForm from "@/components/MovieUploadForm";
import MovieEditDialog from "@/components/MovieEditDialog";

interface Movie {
  id: string;
  title: string;
  description?: string;
  genre: string;
  status: string;
  created_at: string;
  poster_url?: string;
  director?: string;
  movie_cast?: string[];
  release_year?: number;
  duration?: number;
  trailer_url?: string;
  video_url?: string;
  download_url?: string;
}

interface AnalyticsData {
  id: string;
  action: string;
  movie_id?: string;
  user_id?: string;
  created_at: string;
  metadata?: any;
}

interface ContentApproval {
  id: string;
  movie_id: string;
  status: string;
  review_notes?: string;
  submitted_at: string;
  movies?: {
    id: string;
    title: string;
    description?: string;
    genre: string;
    poster_url?: string;
  } | null;
}

export default function AdminDashboard() {
  console.log('AdminDashboard component rendering...');
  const { user, isAdmin, isModerator, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [approvals, setApprovals] = useState<ContentApproval[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simpler access check - check roles directly
  const userRoles = user ? (user as any).app_metadata?.roles || [] : [];
  const hasAccess = user && (userRoles.includes('admin') || userRoles.includes('moderator') || isAdmin() || isModerator());

  console.log('AdminDashboard - User:', user?.email, 'hasAccess:', hasAccess, 'authLoading:', authLoading);

  useEffect(() => {
    // Wait for auth to load completely
    if (authLoading) return;

    // Check access and redirect if necessary
    if (!user) {
      console.log('No user, redirecting to auth');
      navigate("/auth");
      toast.error("Please sign in to access the admin dashboard.");
      return;
    }

    if (!hasAccess) {
      console.log('No admin access, redirecting to home');
      navigate("/");
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    // If we have access, fetch data
    if (hasAccess) {
      fetchDashboardData();
    }
  }, [user, hasAccess, authLoading, navigate]);

  const fetchDashboardData = async () => {
    console.log('Fetching dashboard data...');
    setDataLoading(true);
    setError(null);
    
    try {
      // Fetch movies
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (moviesError) {
        console.error('Movies error:', moviesError);
        throw moviesError;
      }
      
      console.log('Movies fetched:', moviesData?.length);
      setMovies(moviesData || []);

      // Fetch analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (analyticsError) {
        console.error('Analytics error:', analyticsError);
        // Don't throw for analytics, just log
        setAnalytics([]);
      } else {
        setAnalytics(analyticsData || []);
      }

      // Fetch content approvals
      const { data: approvalsData, error: approvalsError } = await supabase
        .from('content_approvals')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (approvalsError) {
        console.error('Approvals error:', approvalsError);
        setApprovals([]);
      } else {
        // Get movie details for approvals
        const approvalsWithMovies = await Promise.all(
          (approvalsData || []).map(async (approval) => {
            const { data: movieData } = await supabase
              .from('movies')
              .select('id, title, description, genre, poster_url')
              .eq('id', approval.movie_id)
              .single();
            
            return {
              ...approval,
              movies: movieData || null
            };
          })
        );
        setApprovals(approvalsWithMovies);
      }

      console.log('Dashboard data loaded successfully');
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      setError(error.message);
      toast.error("Failed to load dashboard data: " + error.message);
    } finally {
      setDataLoading(false);
    }
  };

  const updateMovieStatus = async (movieId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ 
          status, 
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', movieId);

      if (error) throw error;

      // Update approval record
      const { error: approvalError } = await supabase
        .from('content_approvals')
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('movie_id', movieId);

      if (approvalError) console.error('Approval update error:', approvalError);

      toast.success(`Movie ${status} successfully`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error("Failed to update movie status: " + error.message);
    }
  };

  const deleteMovie = async (movieId: string) => {
    try {
      // Delete from content_approvals first (if exists)
      await supabase
        .from('content_approvals')
        .delete()
        .eq('movie_id', movieId);

      // Delete the movie
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);

      if (error) throw error;

      toast.success("Movie deleted successfully");
      fetchDashboardData();
    } catch (error: any) {
      toast.error("Failed to delete movie: " + error.message);
    }
  };

  const getAnalyticsStats = () => {
    const totalViews = analytics.filter(a => a.action === 'view').length;
    const totalDownloads = analytics.filter(a => a.action === 'download').length;
    const totalStreams = analytics.filter(a => a.action === 'stream').length;
    const totalSearches = analytics.filter(a => a.action === 'search').length;

    return { totalViews, totalDownloads, totalStreams, totalSearches };
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while data is loading
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error if there was a problem
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Don't render anything if no access (navigation should have happened)
  if (!hasAccess) {
    return null;
  }

  const stats = getAnalyticsStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage movies, users, and monitor platform activity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{movies.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streams</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStreams}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList>
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Content Approval
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Movie
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies">
            <Card>
              <CardHeader>
                <CardTitle>Movie Management</CardTitle>
                <CardDescription>
                  Manage all movies in the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movies.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No movies found
                    </p>
                  ) : (
                    movies.map((movie) => (
                      <div key={movie.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {movie.poster_url && (
                            <img 
                              src={movie.poster_url} 
                              alt={movie.title}
                              className="w-16 h-24 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">{movie.title}</h3>
                            <p className="text-sm text-muted-foreground">{movie.genre}</p>
                            <Badge variant={
                              movie.status === 'approved' ? 'default' :
                              movie.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }>
                              {movie.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <MovieEditDialog movie={movie} onSuccess={fetchDashboardData} />
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Movie</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{movie.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteMovie(movie.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Movie
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {movie.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateMovieStatus(movie.id, 'approved')}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateMovieStatus(movie.id, 'rejected')}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Content Approval Queue</CardTitle>
                <CardDescription>
                  Review and approve submitted content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvals.filter(approval => approval.status === 'pending').map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{approval.movies?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(approval.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => updateMovieStatus(approval.movie_id, 'approved')}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateMovieStatus(approval.movie_id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {approvals.filter(approval => approval.status === 'pending').length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No pending approvals
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  Monitor user activity and content performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Search className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{stats.totalSearches}</div>
                      <div className="text-sm text-muted-foreground">Searches</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{stats.totalViews}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Play className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">{stats.totalStreams}</div>
                      <div className="text-sm text-muted-foreground">Streams</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Download className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <div className="text-2xl font-bold">{stats.totalDownloads}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                    {analytics.slice(0, 20).map((activity, index) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div>
                          <span className="capitalize font-medium">{activity.action}</span>
                          {activity.movie_id && (
                            <span className="text-sm text-muted-foreground ml-2">
                              Movie ID: {activity.movie_id.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {analytics.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No analytics data available
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <MovieUploadForm onSuccess={fetchDashboardData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}