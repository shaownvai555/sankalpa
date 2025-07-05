import React, { useState, useEffect } from 'react';
import { Badge } from '../utils/badgeSystem';

interface BadgeImageProps {
  badge: Badge;
  className?: string;
  fallbackClassName?: string;
  fallbackContent?: React.ReactNode;
  alt?: string;
}

const BadgeImage: React.FC<BadgeImageProps> = ({ 
  badge, 
  className = "w-10 h-10 rounded-full object-cover",
  fallbackClassName = "w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center",
  fallbackContent,
  alt = "Badge"
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset error state when badge changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [badge.imageUrl]);

  const handleImageError = () => {
    console.warn(`Failed to load badge image: ${badge.imageUrl}`);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Show fallback if image failed to load or hasn't loaded yet
  if (imageError || !imageLoaded) {
    return (
      <div className="relative">
        {/* Hidden image for loading */}
        {!imageError && (
          <img
            src={badge.imageUrl}
            alt={alt}
            className="hidden"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Fallback content */}
        <div className={fallbackClassName}>
          {fallbackContent || (
            <span className="text-white font-bold text-sm">
              {badge.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={badge.imageUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};

export default BadgeImage;