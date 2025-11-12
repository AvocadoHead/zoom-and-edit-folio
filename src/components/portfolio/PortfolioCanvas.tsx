import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Eye, ZoomIn, ZoomOut, Maximize2, Save, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { MediaItem } from './MediaItem';
import { CategoryLabel } from './CategoryLabel';
// Import types but not default data; runtime content will be loaded from JSON.
import { mediaItems as defaultMediaItems, categories as defaultCategories } from '@/data/portfolioData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const PortfolioCanvas = () => {
  // Determine whether edit mode should be enabled.  When VITE_EDIT_MODE is set
  // during the build (see vite.config.ts), the global __EDIT_MODE__ constant will
  // be truthy. We fallback to checking the URL for ?edit=true so that
  // developers can enable editing locally without a rebuild.  Edit mode is off
  // by default in production builds.
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // State for media items and categories. These will be populated from
  // `/content/portfolio.json` on mount. We provide the existing TS defaults as
  // a fallback in case the fetch fails or the file is missing so that the app
  // still renders gracefully.
  const [mediaItems, setMediaItems] = useState(defaultMediaItems);
  const [categories, setCategories] = useState(defaultCategories);
  const [currentScale, setCurrentScale] = useState(1);
  const { toast } = useToast();

  /**
   * Export the current layout (media items and categories) as a JSON file.  This
   * allows editors to persist their changes by downloading the file and
   * committing it back to the repository (or uploading via the CMS).  The
   * downloaded file is named `portfolio-layout.json` to distinguish it from
   * the source `portfolio.json` in the public folder.
   */
  const saveLayout = () => {
    try {
      const data = JSON.stringify({ mediaItems, categories }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-layout.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: 'Layout Saved',
        description: 'A JSON file has been downloaded. Commit it to update the site.',
      });
    } catch (err) {
      toast({
        title: 'Error Saving',
        description: 'Could not export layout. See console for details.',
        variant: 'destructive',
      });
      // eslint-disable-next-line no-console
      console.error('Failed to save layout', err);
    }
  };

  /**
   * Copy a public (view-only) link to the clipboard.  This removes the
   * `edit=true` query parameter from the current URL so the recipient will
   * see the portfolio in view mode.  A toast confirms the action.
   */
  const copyPublicLink = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('edit');
      const link = url.toString();
      void navigator.clipboard.writeText(link).then(() => {
        toast({
          title: 'Link Copied',
          description: 'Public view link copied to clipboard',
        });
      });
    } catch (err) {
      toast({
        title: 'Error Copying',
        description: 'Could not copy link. See console for details.',
        variant: 'destructive',
      });
      // eslint-disable-next-line no-console
      console.error('Failed to copy public link', err);
    }
  };

  // Check URL parameter for edit mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlEdit = params.get('edit');
    // __EDIT_MODE__ is defined at build time in vite.config.ts.  It will be
    // `true` when VITE_EDIT_MODE=true during development and `false` in
    // production.
    // eslint-disable-next-line no-undef
    const buildEdit: boolean = typeof __EDIT_MODE__ !== 'undefined' ? (__EDIT_MODE__ as boolean) : false;
    if (buildEdit || urlEdit === 'true') {
      setIsEditMode(true);
      toast({
        title: 'Edit Mode Enabled',
        description: 'You can now drag and resize items',
      });
    }
    // Load portfolio data from the public folder.  We fetch on mount so that
    // updates made via the CMS (which commits changes to the JSON file) are
    // reflected without a rebuild.
    fetch('/content/portfolio.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load portfolio data');
        return res.json();
      })
      .then((data) => {
        if (data.mediaItems && Array.isArray(data.mediaItems)) {
          setMediaItems(data.mediaItems);
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {
        // If the fetch fails for any reason, fall back to the default TS data.
        setMediaItems(defaultMediaItems);
        setCategories(defaultCategories);
      });
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

          {/* Show additional controls only in edit mode */}
          {isEditMode && (
            <>
              <Button
                onClick={saveLayout}
                variant="outline"
                size="sm"
                className="shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>
              <Button
                onClick={copyPublicLink}
                variant="outline"
                size="sm"
                className="shadow-lg"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={() => {
                  // Open Decap CMS in a new tab/window
                  window.open('/admin', '_blank');
                }}
                variant="outline"
                size="sm"
                className="shadow-lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </>
          )}
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
