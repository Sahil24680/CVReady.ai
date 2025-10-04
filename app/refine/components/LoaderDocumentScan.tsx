
interface LoaderDocumentScanProps {
  message?: string;
  subtext?: string;
  progress?: number;
}

const LoaderDocumentScan: React.FC<LoaderDocumentScanProps> = ({
  message = "Preparing PDF viewer...",
  subtext,
  progress
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-full p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <div className="relative mb-6">
        {/* Document outline */}
        <div className="w-20 h-28 bg-white border-2 border-blue-200 rounded-lg shadow-lg relative overflow-hidden">
          {/* Document content lines */}
          <div className="p-3 space-y-2">
            <div className="h-1.5 bg-gray-200 rounded"></div>
            <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
            <div className="h-1.5 bg-gray-200 rounded w-3/5"></div>
            <div className="h-1.5 bg-gray-200 rounded"></div>
            <div className="h-1.5 bg-gray-200 rounded w-2/3"></div>
          </div>
          
          {/* Scanning line animation */}
          <div className="absolute inset-0">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
            <div className="w-full h-0.5 bg-blue-400 absolute top-0 animate-ping"></div>
          </div>
        </div>
        
        {/* Floating scan indicators */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium text-gray-800 mb-2">{message}</p>
        {subtext && (
          <p className="text-sm text-gray-600">{subtext}</p>
        )}
        {progress !== undefined && (
          <div className="mt-4">
            <p className="text-sm text-blue-600 font-semibold mb-2">{Math.round(progress)}% complete</p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoaderDocumentScan;