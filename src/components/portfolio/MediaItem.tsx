import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { MediaItem as MediaItemType } from '@/data/portfolioData';

interface MediaItemProps {
  item: MediaItemType;
  isEditMode: boolean;
  onUpdate: (id: string, updates: Partial<MediaItemType>) => void;
  scale: number;
}

export const MediaItem = ({ item, isEditMode, onUpdate, scale }: MediaItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getMediaSrc = () => {
    if (item.type === 'gdrive' && item.driveId) {
      return `https://drive.google.com/file/d/${item.driveId}/preview`;
    }
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
        {item.type === 'gdrive' ? (
          <iframe
            src={getMediaSrc()}
            className="w-full h-full"
            allow="autoplay"
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

      {/* Edit Mode Handle */}
      {isEditMode && (
        <div className="absolute -top-8 left-0 flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
          <span className="font-medium">{item.title}</span>
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
        {content}
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
