import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export interface MovieFilters {
  genre: string;
  releaseYear: [number, number];
  rating: [number, number];
  duration: [number, number];
  quality: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface MovieFiltersProps {
  filters: MovieFilters;
  onFiltersChange: (filters: MovieFilters) => void;
  onClearFilters: () => void;
  availableGenres: string[];
}

const currentYear = new Date().getFullYear();

const qualityOptions = [
  { id: 'hd', label: 'HD (720p)' },
  { id: 'fullhd', label: 'Full HD (1080p)' },
  { id: '4k', label: '4K Ultra HD' },
];

const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'release_year', label: 'Release Year' },
  { value: 'rating', label: 'Rating' },
  { value: 'duration', label: 'Duration' },
  { value: 'created_at', label: 'Date Added' },
];

const MovieFilters = ({ filters, onFiltersChange, onClearFilters, availableGenres }: MovieFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof MovieFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleQuality = (qualityId: string) => {
    const newQuality = filters.quality.includes(qualityId)
      ? filters.quality.filter(q => q !== qualityId)
      : [...filters.quality, qualityId];
    updateFilter('quality', newQuality);
  };

  const hasActiveFilters = 
    filters.genre !== 'all' ||
    filters.releaseYear[0] !== 1900 ||
    filters.releaseYear[1] !== currentYear ||
    filters.rating[0] !== 0 ||
    filters.rating[1] !== 10 ||
    filters.duration[0] !== 0 ||
    filters.duration[1] !== 300 ||
    filters.quality.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filters.genre} onValueChange={(value) => updateFilter('genre', value)}>
          <SelectTrigger className="w-24 md:w-32 text-xs md:text-sm">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {availableGenres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger className="w-24 md:w-32 text-xs md:text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}>
          <SelectTrigger className="w-16 md:w-24 text-xs md:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">↓ Desc</SelectItem>
            <SelectItem value="asc">↑ Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative text-xs md:text-sm px-2 md:px-4">
            <SlidersHorizontal className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 md:ml-2 px-1 py-0 text-xs bg-accent text-accent-foreground">
                {[
                  filters.genre !== 'all' && 'Genre',
                  filters.releaseYear[0] !== 1900 || filters.releaseYear[1] !== currentYear && 'Year',
                  filters.rating[0] !== 0 || filters.rating[1] !== 10 && 'Rating',
                  filters.duration[0] !== 0 || filters.duration[1] !== 300 && 'Duration',
                  filters.quality.length > 0 && 'Quality',
                ].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-gradient-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Advanced Filters
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Release Year */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Release Year</label>
              <div className="px-2">
                <Slider
                  value={filters.releaseYear}
                  onValueChange={(value) => updateFilter('releaseYear', value)}
                  min={1900}
                  max={currentYear}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.releaseYear[0]}</span>
                  <span>{filters.releaseYear[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Rating</label>
              <div className="px-2">
                <Slider
                  value={filters.rating}
                  onValueChange={(value) => updateFilter('rating', value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.rating[0].toFixed(1)}</span>
                  <span>{filters.rating[1].toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <div className="px-2">
                <Slider
                  value={filters.duration}
                  onValueChange={(value) => updateFilter('duration', value)}
                  min={0}
                  max={300}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.duration[0]}min</span>
                  <span>{filters.duration[1]}min</span>
                </div>
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Available Quality</label>
              <div className="space-y-2">
                {qualityOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.quality.includes(option.id)}
                      onCheckedChange={() => toggleQuality(option.id)}
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm cursor-pointer select-none"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground text-xs md:text-sm px-2 md:px-3"
        >
          <X className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      )}
    </div>
  );
};

export default MovieFilters;