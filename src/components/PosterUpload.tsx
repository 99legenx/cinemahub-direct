import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X, Link } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PosterUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function PosterUpload({ value, onChange, disabled }: PosterUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `poster_${Date.now()}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('movie-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('movie-assets')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onChange(publicUrl);
      toast.success("Poster uploaded successfully!");
    } catch (error: any) {
      toast.error("Failed to upload poster: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreviewUrl("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
          disabled={disabled}
        >
          <Link className="w-4 h-4 mr-1" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("file")}
          disabled={disabled}
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
      </div>

      {uploadMode === "url" ? (
        <div>
          <Label htmlFor="poster_url">Poster URL</Label>
          <Input
            id="poster_url"
            value={previewUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/poster.jpg"
            disabled={disabled}
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="poster_file">Upload Poster Image</Label>
          <input
            ref={fileInputRef}
            id="poster_file"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Image File
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {previewUrl && (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Poster preview"
                className="w-20 h-28 object-cover rounded-md bg-muted"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={clearImage}
                disabled={disabled}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Poster Preview</p>
              <p className="text-xs text-muted-foreground break-all">
                {previewUrl}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}