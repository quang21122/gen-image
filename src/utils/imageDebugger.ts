// Image Generation Debugging Utilities

interface ImageGenerationLog {
  requestId: string;
  timestamp: string;
  originalPrompt: string;
  translatedPrompt: string;
  enhancedPrompt: string;
  style: string;
  apiRequest: Record<string, unknown>;
  responseType: "binary" | "base64";
  imageSize: number;
  imageUrl: string;
  processingTime: number;
  success: boolean;
  error?: string;
}

class ImageDebugger {
  private logs: ImageGenerationLog[] = [];
  private readonly MAX_LOGS = 50;

  logImageGeneration(log: ImageGenerationLog): void {
    this.logs.unshift(log);

    // Keep only the most recent logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem("image-generation-logs", JSON.stringify(this.logs));
    } catch (error) {
      console.warn("Failed to save debug logs to localStorage:", error);
    }
  }

  getRecentLogs(count: number = 10): ImageGenerationLog[] {
    return this.logs.slice(0, count);
  }

  getAllLogs(): ImageGenerationLog[] {
    return [...this.logs];
  }

  findLogByRequestId(requestId: string): ImageGenerationLog | undefined {
    return this.logs.find((log) => log.requestId === requestId);
  }

  findLogsByPrompt(prompt: string): ImageGenerationLog[] {
    const searchTerm = prompt.toLowerCase();
    return this.logs.filter(
      (log) =>
        log.originalPrompt.toLowerCase().includes(searchTerm) ||
        log.translatedPrompt.toLowerCase().includes(searchTerm) ||
        log.enhancedPrompt.toLowerCase().includes(searchTerm)
    );
  }

  getSuccessRate(): { total: number; successful: number; rate: number } {
    const total = this.logs.length;
    const successful = this.logs.filter((log) => log.success).length;
    const rate = total > 0 ? (successful / total) * 100 : 0;

    return { total, successful, rate };
  }

  getAverageProcessingTime(): number {
    const successfulLogs = this.logs.filter((log) => log.success);
    if (successfulLogs.length === 0) return 0;

    const totalTime = successfulLogs.reduce(
      (sum, log) => sum + log.processingTime,
      0
    );
    return totalTime / successfulLogs.length;
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem("image-generation-logs");
    } catch (error) {
      console.warn("Failed to clear debug logs from localStorage:", error);
    }
  }

  // Load logs from localStorage on initialization
  private loadLogs(): void {
    try {
      const stored = localStorage.getItem("image-generation-logs");
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load debug logs from localStorage:", error);
      this.logs = [];
    }
  }

  // Initialize the debugger
  init(): void {
    this.loadLogs();

    // Add global debugging functions for console access
    if (typeof window !== "undefined") {
      (window as typeof window & { imageDebugger: unknown }).imageDebugger = {
        getLogs: () => this.getAllLogs(),
        getRecentLogs: (count?: number) => this.getRecentLogs(count),
        findByPrompt: (prompt: string) => this.findLogsByPrompt(prompt),
        getStats: () => ({
          successRate: this.getSuccessRate(),
          averageTime: this.getAverageProcessingTime(),
          totalLogs: this.logs.length,
        }),
        exportLogs: () => this.exportLogs(),
        clearLogs: () => this.clearLogs(),
      };
    }
  }

  // Check for potential issues in recent generations
  analyzeRecentIssues(): string[] {
    const issues: string[] = [];
    const recentLogs = this.getRecentLogs(10);

    // Check for high failure rate
    const failedRecent = recentLogs.filter((log) => !log.success);
    if (failedRecent.length > recentLogs.length * 0.5) {
      issues.push(
        `High failure rate: ${failedRecent.length}/${recentLogs.length} recent requests failed`
      );
    }

    // Check for slow processing times
    const avgTime = this.getAverageProcessingTime();
    const slowLogs = recentLogs.filter(
      (log) => log.success && log.processingTime > avgTime * 2
    );
    if (slowLogs.length > 0) {
      issues.push(
        `${slowLogs.length} recent requests were unusually slow (>${(
          avgTime * 2
        ).toFixed(0)}ms)`
      );
    }

    // Check for prompt translation issues
    const translationIssues = recentLogs.filter(
      (log) =>
        log.originalPrompt !== log.translatedPrompt &&
        log.translatedPrompt.length < log.originalPrompt.length * 0.5
    );
    if (translationIssues.length > 0) {
      issues.push(
        `${translationIssues.length} requests may have translation issues`
      );
    }

    // Check for empty or very small images
    const smallImages = recentLogs.filter(
      (log) => log.success && log.imageSize < 1000
    );
    if (smallImages.length > 0) {
      issues.push(
        `${smallImages.length} requests generated unusually small images (<1KB)`
      );
    }

    return issues;
  }
}

// Export singleton instance
export const imageDebugger = new ImageDebugger();

// Initialize on import
imageDebugger.init();

// Export types
export type { ImageGenerationLog };
