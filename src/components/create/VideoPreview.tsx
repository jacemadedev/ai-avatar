interface VideoPreviewProps {
  url: string | null;
  status: string;
  error: string | null;
}

export function VideoPreview({ url, status, error }: VideoPreviewProps) {
  return (
    <div className="space-y-4">
      {status && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p>Status: {status}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
          <p>Error: {error}</p>
        </div>
      )}

      {url && (
        <div className="mt-8">
          <video 
            controls 
            className="max-h-[70vh] w-auto mx-auto rounded-lg"
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
} 