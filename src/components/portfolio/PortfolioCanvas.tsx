import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  Link as LinkIcon,
  Plus,
  Type,
  Paintbrush,
} from 'lucide-react';
import { MediaItem } from './MediaItem';
import { CategoryLabel } from './CategoryLabel';
import { TextElement, TextElementType } from './TextElement';
import { TextStyleToolbar } from './TextStyleToolbar';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawToolbar } from './DrawToolbar';
import { AddMediaDialog } from './AddMediaDialog';
// Import types but not default data; runtime content will be loaded from JSON.
import { mediaItems as defaultMediaItems, categories as defaultCategories } from '@/data/portfolioData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * PortfolioCanvas is the main component responsible for rendering the
 * interactive, infinite canvas. It supports edit and view modes, dynamic
 * loading of content from a JSON file, adding and deleting media and text
 * elements, freehand drawing, and configurable dot‑grid backgrounds. The
 * component is designed to be easily extended; new tools can be added via
 * additional buttons in the control panel.
 */
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
  // Additional state for text elements and drawing.  These are persisted via
  // saveLayout() and loaded from JSON if present.
  const [textElements, setTextElements] = useState<TextElementType[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [drawingData, setDrawingData] = useState('');
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);
  // Dot grid state: size, opacity and color can be adjusted in edit mode.
  const [dotSize, setDotSize] = useState(30);
  const [dotOpacity, setDotOpacity] = useState(0.4);
  const [dotColor, setDotColor] = useState('hsl(var(--canvas-grid))');
  const { toast } = useToast();

  // Define the overall dimensions of the infinite canvas.  These values
  // correspond to the coordinate space used for positioning items and text.
  const CANVAS_WIDTH = 25000;
  const CANVAS_HEIGHT = 25000;

  /**
   * Export the current layout (media items, categories, text and drawing) as a
   * JSON file.  This allows editors to persist their changes by downloading
   * the file and committing it back to the repository (or uploading via
   * Decap CMS).  The downloaded file is named `portfolio.json` to match
   * the convention used by the app.
   */
  const saveLayout = () => {
    try {
      const data = JSON.stringify({
        mediaItems,
        categories,
        textElements,
        drawingData,
      }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: 'Layout Saved',
        description: 'portfolio.json downloaded. Commit it to /public/content/',
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

  // Check URL parameter for edit mode and load JSON data on mount.  We only
  // perform this effect once.  If the JSON fetch fails we fall back to the
  // default TypeScript data.
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
        if (data.textElements && Array.isArray(data.textElements)) {
          setTextElements(data.textElements);
        }
        if (typeof data.drawingData === 'string') {
          setDrawingData(data.drawingData);
        }
      })
      .catch(() => {
        // If the fetch fails for any reason, fall back to the default TS data.
        setMediaItems(defaultMediaItems);
        setCategories(defaultCategories);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMediaItem = (id: string, updates: any) => {
    setMediaItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((items) => items.filter((item) => item.id !== id));
    toast({ title: 'Media Deleted', description: 'Media item removed from canvas' });
  };

  const addMediaItem = (item: any) => {
    const newItem = {
      ...item,
      id: `media-${Date.now()}`,
    };
    setMediaItems((items) => [...items, newItem]);
  };

  const updateCategory = (id: string, updates: any) => {
    setCategories((cats) =>
      cats.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const updateTextElement = (id: string, updates: Partial<TextElementType>) => {
    setTextElements((elements) =>
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  /**
   * Add a new text element to the canvas.  Unlike the previous implementation
   * that placed text at a fixed coordinate, we now calculate a random
   * position near the visible portion of the canvas.  This makes it much
   * easier to find new text elements without scrolling across the entire
   * canvas.  The coordinates chosen here (3000–5000) correspond to a
   * comfortable viewing region when the canvas initially loads.
   */
  const addTextElement = () => {
  const randomPos = () => 2000 + Math.random() * 3000;    const newText: TextElementType = {
      id: `text-${Date.now()}`,
      text: 'Double-click to edit',
      x: randomPos(),
      y: randomPos(),
      fontSize: 24,
      fontFamily: 'Heebo, sans-serif',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false,
      width: 300,
    };
    setTextElements([...textElements, newText]);
    toast({ title: 'Text Added', description: 'New text element added. Scroll to find it.' });
  };

  const deleteTextElement = (id: string) => {
    setTextElements((elements) => elements.filter((el) => el.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
    toast({ title: 'Text Deleted', description: 'Text element removed from canvas' });
  };

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
    setIsDrawMode(false);
    setSelectedTextId(null);

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

  const selectedText = textElements.find((el) => el.id === selectedTextId) || null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-canvas-bg">
      {/* Control Bar */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-6 right-6 z-50 flex items-center gap-2"
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
                View
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>

          {isEditMode && (
            <>
              <Button
                onClick={() => setShowAddMedia(true)}
                variant="outline"
                size="sm"
                className="shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
              <Button
                onClick={addTextElement}
                variant="outline"
                size="sm"
                className="shadow-lg"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text
              </Button>
              <Button
                onClick={() => {
                  setIsDrawMode(!isDrawMode);
                  if (!isDrawMode) {
                    toast({
                      title: 'Draw Mode',
                      description: 'Click and drag to draw on the canvas',
                    });
                  }
                }}
                variant={isDrawMode ? 'default' : 'outline'}
                size="sm"
                className="shadow-lg"
              >
                <Paintbrush className="w-4 h-4 mr-2" />
                Draw
              </Button>
              <Button
                onClick={saveLayout}
                variant="outline"
                size="sm"
                className="shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
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
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Grid Settings Panel */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 right-6 bg-card border border-border rounded-lg p-3 w-48 shadow-lg z-40"
        >
          <h3 className="text-sm font-semibold mb-2">Grid Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Dot Size: {dotSize}px</label>
              <input
                type="range"
                min={10}
                max={100}
                value={dotSize}
                onChange={(e) => setDotSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Opacity: {(dotOpacity * 100).toFixed(0)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={dotOpacity}
                onChange={(e) => setDotOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Color:</label>
              <input
                type="color"
                value={dotColor}
                onChange={(e) => setDotColor(e.target.value)}
                className="w-full h-8 rounded"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Text Style Toolbar */}
      <AnimatePresence>
        {isEditMode && selectedText && !isDrawMode && (
          <TextStyleToolbar
            selectedText={selectedText}
            onUpdate={updateTextElement}
          />
        )}
      </AnimatePresence>

      {/* Draw Toolbar */}
      <AnimatePresence>
        {isEditMode && isDrawMode && (
          <DrawToolbar
            brushColor={brushColor}
            onBrushColorChange={setBrushColor}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            isEraser={isEraser}
            onEraserToggle={() => setIsEraser(!isEraser)}
            onClearDrawing={() => {
              setDrawingData('');
              toast({ title: 'Drawing Cleared', description: 'Canvas drawing has been cleared' });
            }}
          />
        )}
      </AnimatePresence>

      {/* Add Media Dialog */}
      <AddMediaDialog
        isOpen={showAddMedia}
        onClose={() => setShowAddMedia(false)}
        onAdd={addMediaItem}
      />

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
              exit={{ opacity: 0, x: 20 }}
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
              <div
                className="relative"
                style={{
                  width: `${CANVAS_WIDTH}px`,
                  height: `${CANVAS_HEIGHT}px`,
                  willChange: 'transform',
                }}
              >
                {/* Dot Pattern Background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
                    backgroundSize: `${dotSize}px ${dotSize}px`,
                    opacity: dotOpacity,
                  }}
                />

                {/* Subtle fade at edges */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(
                        ellipse at center,
                        transparent 0%,
                        transparent 60%,
                        hsl(var(--canvas-bg) / 0.3) 80%,
                        hsl(var(--canvas-bg) / 0.7) 95%,
                        hsl(var(--canvas-bg)) 100%
                      )
                    `,
                  }}
                />

                {/* Drawing Canvas Layer */}
                {isEditMode && (
                  <DrawingCanvas
                    isDrawMode={isDrawMode}
                    brushColor={brushColor}
                    brushSize={brushSize}
                    isEraser={isEraser}
                    onDrawingChange={setDrawingData}
                    initialDrawing={drawingData}
                    canvasWidth={CANVAS_WIDTH}
                    canvasHeight={CANVAS_HEIGHT}
                  />
                )}

                {/* Drawing Preview (View Mode) */}
                {!isEditMode && drawingData && (
                  <img
                    src={drawingData}
                    alt="Canvas drawing"
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 30 }}
                  />
                )}

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
                    isEditMode={isEditMode && !isDrawMode}
                    onUpdate={updateMediaItem}
                    onDelete={deleteMediaItem}
                    scale={currentScale}
                  />
                ))}

                {/* Text Elements */}
                {textElements.map((element) => (
                  <TextElement
                    key={element.id}
                    element={element}
                    isEditMode={isEditMode && !isDrawMode}
                    onUpdate={updateTextElement}
                    onDelete={deleteTextElement}
                    onSelect={setSelectedTextId}
                    isSelected={selectedTextId === element.id}
                    scale={currentScale}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Instructions */}
      {isEditMode && !isDrawMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 left-6 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs z-40"
        >
          <h3 className="font-semibold text-sm mb-2">Edit Mode</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Drag items to reposition</li>
            <li>• Resize with corner handles</li>
            <li>• Double-click text to edit</li>
            <li>• Click text to show styling</li>
            <li>• Use Draw button to sketch</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};
