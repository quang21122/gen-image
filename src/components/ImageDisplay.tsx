import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EnhancedLoading } from "@/components/ui/enhanced-loading";
import {
  Download,
  Copy,
  RotateCcw,
  Image as ImageIcon,
  Sparkles,
  Heart,
  Share2,
} from "lucide-react";
import type { ImageGenerationResponse } from "@/types";

interface ImageDisplayProps {
  image: ImageGenerationResponse | null;
  isLoading: boolean;
  onClear?: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  image,
  isLoading,
  onClear,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image.url;
    link.download = `ai-generated-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = async () => {
    if (!image) return;

    try {
      await navigator.clipboard.writeText(image.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  if (isLoading) {
    return (
      <GlassCard variant="elevated" className="w-full p-6 animate-scale-in">
        <div className="text-center space-y-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400 animate-pulse" />
            <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
              Creating Your Masterpiece
            </h3>
          </div>
          <p className="text-secondary-600 dark:text-secondary-400">
            Our AI is working its magic to bring your vision to life...
          </p>
        </div>

        <div className="aspect-square w-full bg-gradient-to-br from-primary-50/50 to-accent-50/50 dark:from-secondary-800/50 dark:to-secondary-700/50 rounded-xl border border-white/30 dark:border-white/20 flex items-center justify-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 via-accent-400/10 to-primary-400/10 animate-gradient bg-[length:200%_200%]" />

          <div className="relative text-center space-y-6">
            <EnhancedLoading variant="pulse" size="lg" text="" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300">
                Generating...
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  <span>Processing prompt</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <span>Creating image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!image) {
    return (
      <GlassCard variant="default" className="w-full p-6 animate-fade-in">
        <div className="text-center space-y-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <ImageIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
              Your Canvas Awaits
            </h3>
          </div>
          <p className="text-secondary-600 dark:text-secondary-400">
            Enter a prompt above to create stunning AI-generated artwork
          </p>
        </div>

        <div className="aspect-square w-full bg-gradient-to-br from-secondary-50/50 to-primary-50/50 dark:from-secondary-800/30 dark:to-secondary-700/30 rounded-xl border-2 border-dashed border-white/40 dark:border-white/20 flex items-center justify-center relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/5 via-accent-400/5 to-primary-400/5 animate-gradient bg-[length:200%_200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-12 h-12 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300">
                Ready to Create
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 max-w-md mx-auto">
                Your AI-generated masterpiece will appear here. Start by
                describing what you'd like to see!
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" className="w-full p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
            Your Masterpiece
          </h3>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="hover:bg-white/20 dark:hover:bg-white/10 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Create New
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <div className="aspect-square w-full overflow-hidden rounded-xl border border-white/30 dark:border-white/20 bg-white/10 dark:bg-white/5">
            <img
              src={image.url}
              alt={image.prompt}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <EnhancedLoading variant="pulse" size="md" />
              </div>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        </div>

        <div className="space-y-4">
          <div className="bg-white/20 dark:bg-white/10 rounded-lg p-4 border border-white/30 dark:border-white/20">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200 mb-1">
                  Prompt:
                </p>
                <p className="text-sm text-secondary-700 dark:text-secondary-300 leading-relaxed">
                  {image.prompt}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-secondary-600 dark:text-secondary-400">
            <span>
              Generated on {new Date(image.created_at).toLocaleString()}
            </span>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>AI Created</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/10 text-secondary-700 dark:text-secondary-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className={`bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/10 text-secondary-700 dark:text-secondary-300 transition-all duration-300 ${
              copySuccess
                ? "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400"
                : ""
            }`}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copySuccess ? "Copied!" : "Copy URL"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/10 text-secondary-700 dark:text-secondary-300"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};
