import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Eye, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { MediaItem } from './MediaItem';
import { CategoryLabel } from './CategoryLabel';
import { mediaItems as initialMediaItems, categories as initialCategories } from '@/data/portfolioData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const PortfolioCanvas = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mediaItems, setMediaItems] = useState(initialMediaItems);
  const [categories, setCategories] = useState(initialCategories);
  const [currentScale, setCurrentScale] = useState(1);
  const { toast } = useToast();

  // Check URL parameter for edit mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editParam = params.get('edit');
    if (editParam === 'true') {
      setIsEditMode(true);
      toast({
        title: 'Edit Mode Enabled',
        description: 'You can now drag and resize items',
      });
    }
  }, []);

  const updateMediaItem = (id: string, updates: any) => {
    setMediaItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const updateCategory = (id: string, updates: any) => {
    setCategories((cats) =>
      cats.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
    
    // Update URL without reload
    const url = new URL(window.location.href);
    if (newMode) {
      url.searchParams.set('edit', 'true');
      toast({
        title: 'Edit Mode Enabled',
        description: 'You can now drag and resize items',
      });
    } else {
      url.searchParams.delete('edit');
      toast({
        title: 'View Mode',
        description: 'Changes saved. Viewing portfolio.',
      });
    }
    window.history.pushState({}, '', url);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-canvas-bg">
      {/* Controls */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 right-6 z-50 flex items-center gap-3"
        >
          <Button
            onClick={toggleEditMode}
            variant={isEditMode ? 'default' : 'outline'}
            size="sm"
            className="shadow-lg"
          >
            {isEditMode ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                View Mode
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Mode
              </>
            )}
          </Button>
        </motion.div>
      </AnimatePresence>

      {/* Canvas */}
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={3}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        panning={{ disabled: isEditMode }}
        centerOnInit
        limitToBounds={false}
        onZoom={(ref) => setCurrentScale(ref.state.scale)}
        velocityAnimation={{
          sensitivity: 1,
          animationTime: 300,
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-6 right-6 z-50 flex flex-col gap-2"
            >
              <Button
                onClick={() => zoomIn()}
                size="icon"
                variant="outline"
                className="shadow-lg bg-card"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => zoomOut()}
                size="icon"
                variant="outline"
                className="shadow-lg bg-card"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => resetTransform()}
                size="icon"
                variant="outline"
                className="shadow-lg bg-card"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </motion.div>

            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
              }}
              contentStyle={{
                width: '100%',
                height: '100%',
              }}
            >
              <div className="relative w-[5000px] h-[5000px]" style={{ willChange: 'transform' }}>
                {/* Grid Background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(hsl(var(--canvas-grid)) 1px, transparent 1px),
                      linear-gradient(90deg, hsl(var(--canvas-grid)) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                  }}
                />

                {/* Category Labels */}
                {categories.map((category) => (
                  <CategoryLabel
                    key={category.id}
                    label={category}
                    isEditMode={isEditMode}
                    onUpdate={updateCategory}
                    scale={currentScale}
                  />
                ))}

                {/* Media Items */}
                {mediaItems.map((item) => (
                  <MediaItem
                    key={item.id}
                    item={item}
                    isEditMode={isEditMode}
                    onUpdate={updateMediaItem}
                    scale={currentScale}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Instructions */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-6 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs"
        >
          <h3 className="font-semibold text-sm mb-2">Edit Mode</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Drag items to reposition</li>
            <li>• Use corner handles to resize</li>
            <li>• Double-click text to edit</li>
            <li>• Scroll to zoom in/out</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};
