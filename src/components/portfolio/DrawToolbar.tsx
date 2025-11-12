import { motion } from 'framer-motion';
import { Paintbrush, Eraser, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface DrawToolbarProps {
  brushColor: string;
  onBrushColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  isEraser: boolean;
  onEraserToggle: () => void;
  onClearDrawing: () => void;
}

/**
 * DrawToolbar provides controls for the drawing mode.  Users can toggle
 * between brush and eraser, pick a brush color, adjust brush size and
 * clear the current drawing.  The toolbar slides in from the left when
 * activated.
 */
export const DrawToolbar = ({
  brushColor,
  onBrushColorChange,
  brushSize,
  onBrushSizeChange,
  isEraser,
  onEraserToggle,
  onClearDrawing,
}: DrawToolbarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex flex-col gap-4 w-48"
    >
      <h3 className="font-semibold text-sm">Drawing Tools</h3>
      {/* Brush/Eraser Toggle */}
      <div className="flex gap-2">
        <Button
          variant={!isEraser ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={onEraserToggle}
        >
          <Paintbrush className="w-4 h-4 mr-2" />
          Brush
        </Button>
        <Button
          variant={isEraser ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={onEraserToggle}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Eraser
        </Button>
      </div>
      {/* Color Picker */}
      {!isEraser && (
        <div className="flex flex-col gap-2">
          <Label className="text-xs">Brush Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brushColor}
              onChange={(e) => onBrushColorChange(e.target.value)}
              className="w-full h-10 rounded border border-input cursor-pointer"
            />
          </div>
        </div>
      )}
      {/* Brush Size */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs">Brush Size: {brushSize}px</Label>
        <Slider
          value={[brushSize]}
          onValueChange={([value]) => onBrushSizeChange(value)}
          min={1}
          max={50}
          step={1}
        />
      </div>
      {/* Clear Drawing */}
      <Button
        variant="destructive"
        size="sm"
        onClick={onClearDrawing}
        className="mt-2"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear Drawing
      </Button>
    </motion.div>
  );
};