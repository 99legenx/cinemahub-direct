import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BulkMovieData {
  title: string;
  description?: string;
  genre: string;
  director?: string;
  movie_cast?: string[];
  release_year?: number;
  duration?: number;
  poster_url?: string;
  trailer_url?: string;
  video_url?: string;
  download_url?: string;
}

interface BulkMovieUploadProps {
  onSuccess?: () => void;
}

export default function BulkMovieUpload({ onSuccess }: BulkMovieUploadProps) {
  const [jsonData, setJsonData] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const downloadTemplate = () => {
    const template = [
      {
        title: "Example Movie 1",
        description: "This is an example movie description",
        genre: "Action",
        director: "John Director",
        movie_cast: ["Actor 1", "Actor 2", "Actor 3"],
        release_year: 2024,
        duration: 120,
        poster_url: "https://example.com/poster1.jpg",
        trailer_url: "https://example.com/trailer1.mp4",
        video_url: "https://example.com/movie1.mp4",
        download_url: "https://example.com/download1.mp4"
      },
      {
        title: "Example Movie 2",
        description: "Another example movie",
        genre: "Comedy",
        director: "Jane Director",
        movie_cast: ["Actor 4", "Actor 5"],
        release_year: 2023,
        duration: 95,
        poster_url: "https://example.com/poster2.jpg",
        trailer_url: "https://example.com/trailer2.mp4",
        video_url: "https://example.com/movie2.mp4",
        download_url: "https://example.com/download2.mp4"
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie-upload-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  const validateMovieData = (movie: any): string[] => {
    const errors: string[] = [];
    
    if (!movie.title || typeof movie.title !== 'string') {
      errors.push("Title is required and must be a string");
    }
    
    if (!movie.genre || typeof movie.genre !== 'string') {
      errors.push("Genre is required and must be a string");
    }
    
    if (movie.release_year && (typeof movie.release_year !== 'number' || movie.release_year < 1900 || movie.release_year > new Date().getFullYear() + 5)) {
      errors.push("Release year must be a valid number between 1900 and " + (new Date().getFullYear() + 5));
    }
    
    if (movie.duration && (typeof movie.duration !== 'number' || movie.duration <= 0)) {
      errors.push("Duration must be a positive number");
    }
    
    if (movie.movie_cast && !Array.isArray(movie.movie_cast)) {
      errors.push("Movie cast must be an array of strings");
    }
    
    return errors;
  };

  const handleBulkUpload = async () => {
    if (!jsonData.trim()) {
      toast.error("Please enter JSON data");
      return;
    }

    setUploading(true);
    setUploadResults(null);

    try {
      const movies: BulkMovieData[] = JSON.parse(jsonData);
      
      if (!Array.isArray(movies)) {
        throw new Error("JSON data must be an array of movie objects");
      }

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        
        // Validate movie data
        const validationErrors = validateMovieData(movie);
        if (validationErrors.length > 0) {
          failedCount++;
          errors.push(`Movie ${i + 1} (${movie.title || 'Untitled'}): ${validationErrors.join(', ')}`);
          continue;
        }

        try {
          const { error } = await supabase
            .from('movies')
            .insert({
              title: movie.title,
              description: movie.description || null,
              genre: movie.genre,
              director: movie.director || null,
              movie_cast: movie.movie_cast || null,
              release_year: movie.release_year || null,
              duration: movie.duration || null,
              poster_url: movie.poster_url || null,
              trailer_url: movie.trailer_url || null,
              video_url: movie.video_url || null,
              download_url: movie.download_url || null,
              status: 'approved' // Auto-approve admin uploads
            });

          if (error) {
            throw error;
          }

          successCount++;
        } catch (error: any) {
          failedCount++;
          errors.push(`Movie ${i + 1} (${movie.title}): ${error.message}`);
        }
      }

      setUploadResults({
        success: successCount,
        failed: failedCount,
        errors
      });

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} movies`);
        if (onSuccess) {
          onSuccess();
        }
      }

      if (failedCount > 0) {
        toast.error(`Failed to upload ${failedCount} movies. Check results below.`);
      }

    } catch (error: any) {
      toast.error("Invalid JSON format: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Movie Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="json-data">Movie Data (JSON Format)</Label>
            <Textarea
              id="json-data"
              placeholder="Paste your JSON movie data here..."
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload multiple movies at once using JSON format. Download the template above to see the required structure. 
              Required fields: title, genre. For poster_url, you can use direct image URLs. All movies will be auto-approved as admin uploads.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleBulkUpload}
            disabled={uploading || !jsonData.trim()}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Movies"}
          </Button>
        </CardContent>
      </Card>

      {uploadResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {uploadResults.success}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Successful
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {uploadResults.failed}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Failed
                  </div>
                </div>
              </div>

              {uploadResults.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">Errors:</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {uploadResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}