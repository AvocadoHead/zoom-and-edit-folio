import { motion } from 'framer-motion';
import { Bold, Italic, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TextElementType } from './TextElement';

interface TextStyleToolbarProps {
  selectedText: TextElementType | null;
  onUpdate: (id: string, updates: Partial<TextElementType>) => void;
}

// Predefined font families; update this list to add new fonts to the dropdown.
const fontFamilies = [
  { name: 'Heebo', value: 'Heebo, sans-serif' },
  { name: 'Rubik', value: 'Rubik, sans-serif' },
  { name: 'Alef', value: 'Alef, sans-serif' },
  { name: 'Assistant', value: 'Assistant, sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
];

/**
 * TextStyleToolbar appears when a text element is selected in edit mode.  It
 * allows users to change the font family, size, color and toggle bold,
 * italic and underline styles.  The toolbar animates in/out smoothly.
 */
export const TextStyleToolbar = ({ selectedText, onUpdate }: TextStyleToolbarProps) => {
  if (!selectedText) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-4 min-w-[600px]"
    >
      {/* Font Family */}
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Font</Label>
        <select
          value={selectedText.fontFamily}
          onChange={(e) => onUpdate(selectedText.id, { fontFamily: e.target.value })}
          className="bg-background border border-input rounded px-2 py-1 text-sm"
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>
      {/* Font Size */}
      <div className="flex flex-col gap-1 w-32">
        <Label className="text-xs">Size: {selectedText.fontSize}px</Label>
        <Slider
          value={[selectedText.fontSize]}
          onValueChange={([value]) => onUpdate(selectedText.id, { fontSize: value })}
          min={12}
          max={72}
          step={1}
        />
      </div>
      {/* Color Picker */}
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Color</Label>
        <input
          type="color"
          value={selectedText.color}
          onChange={(e) => onUpdate(selectedText.id, { color: e.target.value })}
          className="w-10 h-8 rounded border border-input cursor-pointer"
        />
      </div>
      {/* Formatting Buttons */}
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant={selectedText.bold ? 'default' : 'outline'}
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdate(selectedText.id, { bold: !selectedText.bold })}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={selectedText.italic ? 'default' : 'outline'}
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdate(selectedText.id, { italic: !selectedText.italic })}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={selectedText.underline ? 'default' : 'outline'}
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdate(selectedText.id, { underline: !selectedText.underline })}
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};