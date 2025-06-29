import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md', 
    lg: 'loading-lg'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <span className={cn("loading loading-spinner text-primary", sizeClasses[size], className)}></span>
    </div>
  );
}