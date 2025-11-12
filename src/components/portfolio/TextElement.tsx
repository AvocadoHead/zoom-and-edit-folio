import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Type, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

/**
 * The TextElement component renders a draggable and resizable text box on the
 * canvas.  In edit mode users can double‑click to begin editing the text,
 * adjust its position via drag, resize it using visible corner handles, and
 * delete the element entirely.  A small toolbar appears above the element
 * when hovered to indicate the text tool and provide a delete button.
 */
export interface TextElementType {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  width?: number;
}

interface TextElementProps {
  element: TextElementType;
  isEditMode: boolean;
  onUpdate: (id: string, updates: Partial<TextElementType>) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  scale: number;
}

export const TextElement = ({
  element,
  isEditMode,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
  scale,
}: TextElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(element.text);
  const [isHovered, setIsHovered] = useState(false);

  // When leaving edit mode, persist changes to the parent
  const handleBlur = () => {
    setIsEditing(false);
    if (text !== element.text) {
      onUpdate(element.id, { text });
    }
  };

  // Compute inline styles for the text to reflect current formatting
  const textStyle = {
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.bold ? 'bold' : 'normal',
    fontStyle: element.italic ? 'italic' : 'normal',
    textDecoration: element.underline ? 'underline' : 'none',
  } as React.CSSProperties;

  // The core element content.  In edit mode we show a textarea when
  // double‑clicked; otherwise we display the text.  A small popover with
  // type icon and delete button appears when hovered to aid discoverability.
  const content = (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isEditMode && onSelect(element.id)}
    >
      {isEditMode && !isEditing ? (
        <>
          <div
            className={`p-2 cursor-text transition-all ${
              isSelected ? 'ring-2 ring-accent' : ''
            }`}
            onDoubleClick={() => setIsEditing(true)}
            style={textStyle}
          >
            {element.text}
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-10 left-0 flex items-center gap-2 bg-card border border-border rounded-lg px-2 py-1 shadow-lg"
              >
                <Type className="w-3 h-3 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(element.id);
                  }}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : isEditMode && isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          className="bg-transparent border-2 border-accent outline-none p-2 resize-none"
          style={textStyle}
          autoFocus
          rows={3}
        />
      ) : (
        <div style={textStyle} className="p-2">
          {element.text}
        </div>
      )}
    </div>
  );

  // Edit mode: allow dragging and resizing; attach handles at corners and
  // provide custom cursors.  When resizing, update the width and position.
  if (isEditMode) {
    return (
      <Rnd
        position={{ x: element.x, y: element.y }}
        size={{ width: element.width || 300, height: 'auto' }}
        onDragStop={(e, d) => {
          onUpdate(element.id, { x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          onUpdate(element.id, {
            width: parseInt(ref.style.width),
            x: position.x,
            y: position.y,
          });
        }}
        minWidth={100}
        bounds="parent"
        scale={scale}
        enableResizing={{
          bottomRight: true,
          bottomLeft: true,
          topRight: true,
          topLeft: true,
        }}
        resizeHandleStyles={{
          bottomRight: { cursor: 'nwse-resize' },
          bottomLeft: { cursor: 'nesw-resize' },
          topRight: { cursor: 'nesw-resize' },
          topLeft: { cursor: 'nwse-resize' },
        }}
        resizeHandleClasses={{
          bottomRight: 'hover:bg-accent',
          bottomLeft: 'hover:bg-accent',
          topRight: 'hover:bg-accent',
          topLeft: 'hover:bg-accent',
        }}
      >
        {content}
      </Rnd>
    );
  }

  // View mode: position absolutely without editing or resizing capabilities
  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width || 300,
      }}
    >
      {content}
    </div>
  );
};