import { v4 as uuidv4 } from "uuid";

export interface SavedImageInfo {
  id: string;
  filename: string;
  url: string;
  size: number;
  created_at: string;
}

interface StoredImageData {
  id: string;
  filename: string;
  url: string;
  size: number;
  created_at: string;
  base64Data?: string;
  metadata?: ImageMetadata;
}

export interface ImageMetadata {
  prompt: string;
  style: string;
  settings: {
    steps: number;
    guidance_scale: number;
    width: number;
    height: number;
  };
}

class ImageStorageService {
  private readonly STORAGE_KEY = "ai_generated_images";
  private readonly MAX_STORED_IMAGES = 50; // Limit to prevent storage overflow

  /**
   * Save a base64 image to browser storage and create a blob URL
   */
  async saveImage(
    base64Data: string,
    metadata: ImageMetadata
  ): Promise<SavedImageInfo> {
    try {
      // Generate unique ID and filename
      const id = uuidv4();
      const filename = `ai_image_${id}.png`;

      // Convert base64 to blob
      const blob = await this.base64ToBlob(base64Data);

      // Create blob URL for immediate display
      const url = URL.createObjectURL(blob);

      // Calculate size
      const size = blob.size;

      // Create image info
      const imageInfo: SavedImageInfo = {
        id,
        filename,
        url,
        size,
        created_at: new Date().toISOString(),
      };

      // Store metadata in localStorage for persistence
      await this.storeImageMetadata(id, {
        ...imageInfo,
        metadata,
        base64Data, // Store base64 for persistence
      });

      return imageInfo;
    } catch (error) {
      throw new Error("Failed to save image to storage");
    }
  }

  /**
   * Convert base64 string to Blob
   */
  private async base64ToBlob(base64Data: string): Promise<Blob> {
    try {
      // Remove data URL prefix if present
      const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

      // Convert to binary
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new Blob([bytes], { type: "image/png" });
    } catch (error) {
      throw new Error("Invalid base64 image data");
    }
  }

  /**
   * Store image metadata in localStorage
   */
  private async storeImageMetadata(
    id: string,
    data: StoredImageData
  ): Promise<void> {
    try {
      const stored = this.getStoredImages();

      // Add new image
      stored[id] = data;

      // Cleanup old images if we exceed the limit
      await this.cleanupOldImages(stored);

      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      // Don't throw here as the image is still usable via blob URL
    }
  }

  /**
   * Get all stored images from localStorage
   */
  private getStoredImages(): Record<string, StoredImageData> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Cleanup old images to maintain storage limit
   */
  private async cleanupOldImages(
    stored: Record<string, StoredImageData>
  ): Promise<void> {
    const images = Object.entries(stored);

    if (images.length <= this.MAX_STORED_IMAGES) {
      return;
    }

    // Sort by creation date (oldest first)
    images.sort(
      (a, b) =>
        new Date(a[1].created_at).getTime() -
        new Date(b[1].created_at).getTime()
    );

    // Remove oldest images
    const toRemove = images.slice(0, images.length - this.MAX_STORED_IMAGES);

    for (const [id, imageData] of toRemove) {
      // Revoke blob URL to free memory
      if (imageData.url && imageData.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageData.url);
      }

      delete stored[id];
    }
  }

  /**
   * Get a stored image by ID
   */
  async getStoredImage(id: string): Promise<SavedImageInfo | null> {
    try {
      const stored = this.getStoredImages();
      const imageData = stored[id];

      if (!imageData) {
        return null;
      }

      // If blob URL is revoked, recreate it from base64
      if (
        imageData.base64Data &&
        (!imageData.url || !imageData.url.startsWith("blob:"))
      ) {
        const blob = await this.base64ToBlob(imageData.base64Data);
        imageData.url = URL.createObjectURL(blob);

        // Update stored data
        stored[id] = imageData;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
      }

      return {
        id: imageData.id,
        filename: imageData.filename,
        url: imageData.url,
        size: imageData.size,
        created_at: imageData.created_at,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all stored images
   */
  async getAllStoredImages(): Promise<SavedImageInfo[]> {
    try {
      const stored = this.getStoredImages();
      const images: SavedImageInfo[] = [];

      for (const id of Object.keys(stored)) {
        const image = await this.getStoredImage(id);
        if (image) {
          images.push(image);
        }
      }

      // Sort by creation date (newest first)
      return images.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * Download an image
   */
  async downloadImage(
    imageInfo: SavedImageInfo,
    customFilename?: string
  ): Promise<void> {
    try {
      const response = await fetch(imageInfo.url);
      const blob = await response.blob();

      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = customFilename || imageInfo.filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw new Error("Failed to download image");
    }
  }

  /**
   * Delete a stored image
   */
  async deleteStoredImage(id: string): Promise<void> {
    try {
      const stored = this.getStoredImages();
      const imageData = stored[id];

      if (imageData) {
        // Revoke blob URL to free memory
        if (imageData.url && imageData.url.startsWith("blob:")) {
          URL.revokeObjectURL(imageData.url);
        }

        delete stored[id];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
      }
    } catch (error) {
      throw new Error("Failed to delete image");
    }
  }

  /**
   * Clear all stored images
   */
  async clearAllImages(): Promise<void> {
    try {
      const stored = this.getStoredImages();

      // Revoke all blob URLs
      for (const imageData of Object.values(stored)) {
        if (imageData.url && imageData.url.startsWith("blob:")) {
          URL.revokeObjectURL(imageData.url);
        }
      }

      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      throw new Error("Failed to clear images");
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { count: number; totalSize: number } {
    try {
      const stored = this.getStoredImages();
      const images = Object.values(stored);

      return {
        count: images.length,
        totalSize: images.reduce((total, img) => total + (img.size || 0), 0),
      };
    } catch (error) {
      return { count: 0, totalSize: 0 };
    }
  }
}

// Export singleton instance
export const imageStorage = new ImageStorageService();

// Export utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
