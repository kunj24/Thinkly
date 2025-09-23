import { Loader2 } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export function LoadingSpinner({ size = "default", className = "", showText = true, text = "Loading..." }) {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400`} 
      />
      {showText && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {text}
        </span>
      )}
    </div>
  );
}

export function PageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4 border border-gray-200 dark:border-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

export function ButtonLoader({ className = "" }) {
  return (
    <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
  );
}