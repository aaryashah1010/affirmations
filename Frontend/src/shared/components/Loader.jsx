import { cn } from '../utils/cn.js';

const Loader = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
        sizeClasses[size]
      )}></div>
    </div>
  );
};

export const LoadingDots = ({ className }) => (
  <div className={cn('loading-dots', className)}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export const LoadingSpinner = ({ className }) => (
  <div className={cn('flex items-center justify-center p-4', className)}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
);

export default Loader;
