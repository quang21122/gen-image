import React, { useState, useEffect } from 'react';
import { imageDebugger, type ImageGenerationLog } from '@/utils/imageDebugger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageDebugPanel: React.FC<ImageDebugPanelProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<ImageGenerationLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ImageGenerationLog | null>(null);
  const [stats, setStats] = useState({ successRate: 0, averageTime: 0, totalLogs: 0 });

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    const recentLogs = imageDebugger.getRecentLogs(20);
    setLogs(recentLogs);
    
    const successRate = imageDebugger.getSuccessRate();
    const averageTime = imageDebugger.getAverageProcessingTime();
    setStats({
      successRate: successRate.rate,
      averageTime,
      totalLogs: successRate.total
    });
  };

  const exportLogs = () => {
    const data = imageDebugger.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-generation-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    imageDebugger.clearLogs();
    refreshData();
  };

  const analyzeIssues = () => {
    const issues = imageDebugger.analyzeRecentIssues();
    if (issues.length === 0) {
      alert('No issues detected in recent image generations!');
    } else {
      alert('Issues detected:\n\n' + issues.join('\n'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Image Generation Debug Panel</h2>
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  {stats.totalLogs} total requests
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.averageTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-500">
                  Successful requests only
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={analyzeIssues} size="sm" className="w-full">
                  Analyze Issues
                </Button>
                <Button onClick={exportLogs} size="sm" variant="outline" className="w-full">
                  Export Logs
                </Button>
                <Button onClick={clearLogs} size="sm" variant="destructive" className="w-full">
                  Clear Logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Logs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Log List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.requestId}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedLog?.requestId === log.requestId
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } ${
                      log.success ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {log.originalPrompt}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()} • {log.requestId}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {log.success ? (
                          <span className="text-xs text-green-600 font-medium">
                            {log.processingTime.toFixed(0)}ms
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Failed</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Log Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Request Details</h3>
              {selectedLog ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Request Info</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div><strong>ID:</strong> {selectedLog.requestId}</div>
                      <div><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</div>
                      <div><strong>Style:</strong> {selectedLog.style}</div>
                      <div><strong>Success:</strong> {selectedLog.success ? '✅' : '❌'}</div>
                      {selectedLog.error && (
                        <div><strong>Error:</strong> <span className="text-red-600">{selectedLog.error}</span></div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Prompts</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div>
                        <strong>Original:</strong>
                        <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {selectedLog.originalPrompt}
                        </div>
                      </div>
                      {selectedLog.translatedPrompt !== selectedLog.originalPrompt && (
                        <div>
                          <strong>Translated:</strong>
                          <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {selectedLog.translatedPrompt}
                          </div>
                        </div>
                      )}
                      <div>
                        <strong>Enhanced:</strong>
                        <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {selectedLog.enhancedPrompt}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedLog.success && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Result</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div><strong>Response Type:</strong> {selectedLog.responseType}</div>
                        <div><strong>Image Size:</strong> {(selectedLog.imageSize / 1024).toFixed(1)} KB</div>
                        <div><strong>Processing Time:</strong> {selectedLog.processingTime.toFixed(2)}ms</div>
                        {selectedLog.imageUrl && (
                          <div>
                            <strong>Preview:</strong>
                            <img 
                              src={selectedLog.imageUrl} 
                              alt="Generated" 
                              className="mt-2 max-w-full h-32 object-contain border rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Select a request to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
