export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 animate-spin text-gray-400 border-t-2 border-b-2 border-gray-400 rounded-full" />
    </div>
  );
} 