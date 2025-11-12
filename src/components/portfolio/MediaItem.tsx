import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem as MediaItemType } from '@/data/portfolioData';

interface MediaItemProps {
  item: MediaItemType;
  isEditMode: boolean;
  onUpdate: (id: string, updates: Partial<MediaItemType>) => void;
  /**
   * Delete handler called when the user presses the delete button.  Only
   * defined in edit mode.  The parent should remove the item from state.
   */
  onDelete: (id: string) => void;
  scale: number;
}

export const MediaItem = ({ item, isEditMode, onUpdate, onDelete, scale }: MediaItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Compute the correct source URL for the media item. For Google Drive hosted
   * media we build a preview link based on the file id. For YouTube and
   * arbitrary local/remote sources we simply return the provided `src`.
   */
  const getMediaSrc = () => {
    // Construct the appropriate embed URL based on the media type.  For Drive
    // files we use the standard preview URL.  For YouTube embeds we strip
    // autoplay parameters and explicitly disable autoplay so that audio does
    // not begin playing until the user interacts.  All other sources are
    // returned unchanged.
    if (item.type === 'gdrive' && item.driveId) {
      // Google Drive preview link; the embed player will allow playback in an iframe
      return `https://drive.google.com/file/d/${item.driveId}/preview`;
    }
    if (item.type === 'youtube' && item.src) {
      try {
        const url = new URL(item.src);
        // Disable autoplay if present
        url.searchParams.set('autoplay', '0');
        return url.toString();
      } catch {
        // Fallback to the provided source if URL parsing fails
        return item.src;
      }
    }
    // For YouTube (when src is undefined due to misconfiguration) and local media the `src` field must be defined
    return item.src;
  };

  const content = (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isEditMode && setShowDetails(!showDetails)}
    >
      {/* Media Content */}
      <div className="w-full h-full bg-card rounded-lg overflow-hidden shadow-md border border-media-border transition-all duration-300 hover:shadow-lg">
        {/* Render media differently depending on its type.  We use an iframe for Google Drive and YouTube videos
            because both services provide their own player UIs. For other types (e.g. static images or videos
            served from arbitrary URLs) we fall back to an <img> tag. */}
        {item.type === 'gdrive' || item.type === 'youtube' ? (
          <iframe
            src={getMediaSrc()}
            className="w-full h-full"
            // Only allow fullscreen; disabling autoplay ensures audio does not start until the user presses play
            allow="fullscreen"
            title={item.title}
          />
        ) : (
          <img
            src={getMediaSrc()}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Edit Mode Handle (shows title when hovering) */}
      {isEditMode && (
        <div className="absolute -top-8 left-0 flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
          <span className="font-medium">{item.title}</span>
        </div>
      )}

      {/* Always-visible delete button in edit mode */}
      {isEditMode && (
        <div className="absolute top-2 right-2 z-40">
          <Button
            variant="destructive"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            {/* Use a simple × character instead of an icon to keep the dependency list small */}
            &times;
          </Button>
        </div>
      )}

      {/* Details Overlay (View Mode) */}
      {!isEditMode && showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/95 text-primary-foreground rounded-lg p-6 flex flex-col justify-center cursor-pointer"
        >
          <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
          <p className="text-sm opacity-90">{item.description}</p>
        </motion.div>
      )}

      {/* Hover Indicator (View Mode) */}
      {!isEditMode && isHovered && !showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-accent/10 rounded-lg pointer-events-none border-2 border-accent"
        />
      )}
    </div>
  );

  if (isEditMode) {
    return (
      <Rnd
        position={{ x: item.x, y: item.y }}
        size={{ width: item.width, height: item.width * 0.75 }}
        onDragStop={(e, d) => {
          onUpdate(item.id, { x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          onUpdate(item.id, {
            width: parseInt(ref.style.width),
            x: position.x,
            y: position.y,
          });
        }}
        minWidth={200}
        minHeight={150}
        lockAspectRatio={false}
        bounds="parent"
        scale={scale}
        enableResizing={{
          bottom: true,
          bottomLeft: true,
          bottomRight: true,
          left: true,
          right: true,
          top: true,
          topLeft: true,
          topRight: true,
        }}
        resizeHandleStyles={{
          bottom: { cursor: 'ns-resize' },
          bottomLeft: { cursor: 'nesw-resize' },
          bottomRight: { cursor: 'nwse-resize' },
          left: { cursor: 'ew-resize' },
          right: { cursor: 'ew-resize' },
          top: { cursor: 'ns-resize' },
          topLeft: { cursor: 'nwse-resize' },
          topRight: { cursor: 'nesw-resize' },
        }}
        resizeHandleClasses={{
          bottom: 'hover:bg-accent',
          bottomLeft: 'hover:bg-accent',
          bottomRight: 'hover:bg-accent',
          left: 'hover:bg-accent',
          right: 'hover:bg-accent',
          top: 'hover:bg-accent',
          topLeft: 'hover:bg-accent',
          topRight: 'hover:bg-accent',
        }}
      >
        {/* Wrap content in a relative container to ensure the delete button overlay positions correctly */}
        <div className="relative w-full h-full">
          {content}
        </div>
      </Rnd>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.width * 0.75,
      }}
      className="cursor-pointer"
    >
      {content}
    </div>
  );
};
