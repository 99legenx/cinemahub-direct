import { Download, FileVideo, HardDrive, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Movie } from "@/hooks/useMovies";

interface DownloadOptionsProps {
  movie: Movie;
  onClose: () => void;
}

interface DownloadOption {
  quality: string;
  size: string;
  format: string;
  description: string;
  recommended?: boolean;
}

const downloadOptions: DownloadOption[] = [
  {
    quality: "4K Ultra HD",
    size: "8.5 GB",
    format: "MP4",
    description: "Best quality for large screens",
  },
  {
    quality: "Full HD 1080p",
    size: "3.2 GB",
    format: "MP4",
    description: "Perfect balance of quality and size",
    recommended: true,
  },
  {
    quality: "HD 720p",
    size: "1.8 GB",
    format: "MP4",
    description: "Good quality, smaller file size",
  },
  {
    quality: "SD 480p",
    size: "850 MB",
    format: "MP4",
    description: "Compact size for mobile devices",
  },
];

const DownloadOptions = ({ movie, onClose }: DownloadOptionsProps) => {
  const handleDownload = (option: DownloadOption) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${movie.title} in ${option.quality}`);
    // You could open the download URL or trigger a download API call
    if (movie.download_url) {
      window.open(movie.download_url, '_blank');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-card border-border/50">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Download Options</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-cinema-light">{movie.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.release_year}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Choose your preferred quality and file size</span>
            </div>
          </div>

          <div className="space-y-3">
            {downloadOptions.map((option, index) => (
              <Card
                key={index}
                className="bg-card border-border/50 hover:border-accent/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center">
                        <FileVideo className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{option.quality}</h4>
                          {option.recommended && (
                            <Badge variant="secondary" className="bg-gradient-gold text-primary-foreground text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{option.size}</span>
                          <span>•</span>
                          <span>{option.format}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(option)}
                      className="bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="text-xs text-muted-foreground space-y-2">
              <p>• Downloads are available in MP4 format compatible with all devices</p>
              <p>• Files include embedded subtitles for supported languages</p>
              <p>• Download links are valid for 48 hours after generation</p>
              <p>• Free users can download up to 3 movies per day</p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadOptions;