import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
}

export function BlurImage({
  src,
  alt,
  className = '',
  placeholderColor = '#f5f5f7',
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder with shimmer */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 skeleton-shimmer"
            style={{ backgroundColor: placeholderColor }}
          />
        )}
      </AnimatePresence>

      {/* Actual image */}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
        animate={
          isLoaded
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: 1.1, filter: 'blur(20px)' }
        }
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full h-full object-cover"
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f7] dark:bg-[#2c2c2e]">
          <span className="text-4xl">📷</span>
        </div>
      )}
    </div>
  );
}

// Progressive image that shows thumbnail first, then full image
export function ProgressiveImage({
  src,
  thumbnailSrc,
  alt,
  className = '',
}: {
  src: string;
  thumbnailSrc?: string;
  alt: string;
  className?: string;
}) {
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Thumbnail (blurred) */}
      {thumbnailSrc && (
        <motion.img
          src={thumbnailSrc}
          alt=""
          onLoad={() => setIsThumbnailLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isThumbnailLoaded && !isFullLoaded ? 1 : 0 }}
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
        />
      )}

      {/* Full image */}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsFullLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFullLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full object-cover"
      />

      {/* Loading placeholder */}
      {!isThumbnailLoaded && !isFullLoaded && (
        <div className="absolute inset-0 bg-[#f5f5f7] dark:bg-[#2c2c2e] skeleton-shimmer" />
      )}
    </div>
  );
}
