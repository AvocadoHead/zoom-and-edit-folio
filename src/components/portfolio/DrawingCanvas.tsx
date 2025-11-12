import { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  isDrawMode: boolean;
  brushColor: string;
  brushSize: number;
  isEraser: boolean;
  onDrawingChange: (dataUrl: string) => void;
  initialDrawing?: string;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * DrawingCanvas provides a transparent layer for freehand drawing on the
 * portfolio canvas.  When draw mode is disabled, pointer events are
 * disabled so that underlying media and text remain interactive.  The
 * component persists its drawing as a base64 data URL via the
 * onDrawingChange callback each time the user finishes a stroke.
 */
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
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setContext(ctx);
    // Load initial drawing if provided
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDrawing;
    }
  }, [initialDrawing]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawMode || !context) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.strokeStyle = isEraser ? '#ffffff' : brushColor;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      onDrawingChange(dataUrl);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: isDrawMode ? 'auto' : 'none',
        cursor: isDrawMode ? 'crosshair' : 'default',
        // Place the drawing layer beneath media/text.  A lower z-index
        // combined with DOM order ensures other elements render above it.
        zIndex: 0,
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};