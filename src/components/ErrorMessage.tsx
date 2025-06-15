import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="card bg-error/10 border border-error/20">
      <div className="card-body text-center">
        <AlertCircle className="h-12 w-12 text-error mx-auto mb-3" />
        <h3 className="card-title text-error justify-center mb-2">Oops! Er ging iets mis</h3>
        <p className="text-error/80 mb-4 text-sm">{message}</p>
        {onRetry && (
          <div className="card-actions justify-center">
            <button 
              onClick={onRetry} 
              className="btn btn-outline btn-error btn-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Opnieuw proberen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}