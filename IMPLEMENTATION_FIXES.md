# Implementation Fixes Guide

## Current Status
✅ Grid Settings working
✅ Delete buttons visible  
✅ Add Text button exists
✅ Draw button exists
❌ New text not visible
❌ Text font/size can't change
❌ Video URLs not loading
❌ Drawing layer not functional

---

## COMMIT 1: Fix Text Spawn Location (New Text Not Visible)

**File:** `src/components/portfolio/PortfolioCanvas.tsx`
**Problem:** Text spawns at fixed (2500, 2500) - often off-screen
**Solution:** Spawn near viewport center with randomness

**Find line ~189, replace `addTextElement` function:**

```typescript
const addTextElement = () => {
  // Spawn text at randomized viewport-relative position
  const offsetX = 2500 + (Math.random() * 3000 - 1500);
  const offsetY = 2500 + (Math.random() * 3000 - 1500);
  
  const newText: TextElementType = {
    id: `text-${Date.now()}`,
    text: 'Double-click to edit',
    x: offsetX,
    y: offsetY,
    fontSize: 24,
    fontFamily: 'Heebo, sans-serif',
    color: '#000000',
    bold: false,
    italic: false,
    underline: false,
    width: 300,
  };
  setTextElements([...textElements, newText]);
  toast({ 
    title: 'Text Added', 
    description: 'New text element created. Scroll or zoom to find it.' 
  });
};
```

**Commit Message:** "Fix: Text elements now spawn at randomized viewport position"

---

## COMMIT 2: Enable Text Styling (Font/Size Controls)

**File:** `src/components/portfolio/TextStyleToolbar.tsx`
**Problem:** No font family or size controls visible/working
**Solution:** Add font selector and size slider

**Add these controls to the toolbar:**

```typescript
{/* Font Family Selector */}
<div className="space-y-1">
  <label className="text-xs font-semibold">Font</label>
  <select
    value={selectedText.fontFamily}
    onChange={(e) => onUpdate(selectedText.id, { fontFamily: e.target.value })}
    className="w-full px-2 py-1 border rounded text-sm"
  >
    <option value="Heebo, sans-serif">Heebo (Default)</option>
    <option value="Georgia, serif">Georgia (Serif)</option>
    <option value="Courier New, monospace">Courier (Mono)</option>
    <option value="Arial, sans-serif">Arial (Clean)</option>
    <option value="Trebuchet MS, sans-serif">Trebuchet</option>
  </select>
</div>

{/* Font Size Slider */}
<div className="space-y-1">
  <label className="text-xs font-semibold">Size: {selectedText.fontSize}px</label>
  <input
    type="range"
    min="8"
    max="96"
    value={selectedText.fontSize}
    onChange={(e) => onUpdate(selectedText.id, { fontSize: Number(e.target.value) })}
    className="w-full"
  />
</div>
```

**Commit Message:** "Add: Font family and size controls to text styling toolbar"

---

## COMMIT 3: Fix Video URL Loading (AddMediaDialog)

**File:** `src/components/portfolio/AddMediaDialog.tsx`
**Problem:** Videos added via URL don't render
**Solution:** Ensure URL validation and proper media type handling

**Update the form submission:**

```typescript
const handleAddMedia = () => {
  if (!newMedia.type) {
    toast({ title: 'Error', description: 'Please select a media type' });
    return;
  }

  if (!newMedia.url) {
    toast({ title: 'Error', description: 'Please enter a URL' });
    return;
  }

  // Validate URL format
  try {
    new URL(newMedia.url);
  } catch {
    toast({ title: 'Error', description: 'Invalid URL format' });
    return;
  }

  const newItem = {
    id: `media-${Date.now()}`,
    title: newMedia.title || 'Untitled',
    type: newMedia.type,
    url: newMedia.url,
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    category: newMedia.category || 'General',
  };

  onAdd(newItem);
  toast({
    title: 'Media Added',
    description: `${newMedia.type} added to canvas`,
  });

  // Reset form
  setNewMedia({ type: '', url: '', title: '', category: '' });
  onClose();
};
```

**Commit Message:** "Fix: Improve video/media URL validation and error handling"

---

## COMMIT 4: Enable Drawing Layer (Doodle Functionality)

**File:** `src/components/portfolio/DrawingCanvas.tsx`
**Problem:** Drawing doesn't work - no lines appear
**Solution:** Enable pointer events and fix mouse event handling

**Update the canvas element and event handlers:**

```typescript
import { useRef, useEffect, useState } from 'react';

export const DrawingCanvas = ({
  isDrawMode,
  brushColor,
  brushSize,
  isEraser,
  onDrawingChange,
  initialDrawing,
  canvasWidth,
  canvasHeight,
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load existing drawing if available
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = initialDrawing;
    }
  }, [initialDrawing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDrawMode) return;
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPoint(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !isDrawMode) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPoint(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    saveDrawing();
  };

  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.fillStyle = isEraser ? 'rgba(0,0,0,1)' : brushColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onDrawingChange(canvas.toDataURL());
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: isDrawMode ? 'auto' : 'none',
        cursor: isDrawMode ? 'crosshair' : 'default',
        zIndex: 10,
      }}
    />
  );
};
```

**Commit Message:** "Fix: Enable drawing canvas with proper mouse events and brush functionality"

---

## Testing Checklist

- [ ] Click "Add Text" → text appears on canvas
- [ ] Click text → styling toolbar appears
- [ ] Change font dropdown → text updates
- [ ] Change size slider → text updates  
- [ ] Click "Add Media" → add video URL → video loads
- [ ] Click "Draw" → move mouse → lines appear
- [ ] Change brush color → new strokes use new color
- [ ] Use eraser → removes brush strokes
- [ ] Save Layout → JSON includes all elements

---

## Deployment

After each commit, GitHub Actions will automatically:
1. Build the project
2. Deploy to GitHub Pages
3. Site updates live in ~2 minutes

Visit: https://avocadohead.github.io/zoom-and-edit-folio/?edit=true
