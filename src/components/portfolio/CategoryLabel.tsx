import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Type } from 'lucide-react';
import { CategoryLabel as CategoryLabelType } from '@/data/portfolioData';

interface CategoryLabelProps {
  label: CategoryLabelType;
  isEditMode: boolean;
  onUpdate: (id: string, updates: Partial<CategoryLabelType>) => void;
  scale: number;
}

export const CategoryLabel = ({ label, isEditMode, onUpdate, scale }: CategoryLabelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(label.text);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== label.text) {
      onUpdate(label.id, { text });
    }
  };

  const content = (
    <div className="group relative">
      {isEditMode && !isEditing && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Type className="w-3 h-3" />
          <span>Category</span>
        </div>
      )}
      
      {isEditMode && isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
          }}
          className="bg-transparent border-b-2 border-accent text-4xl font-bold text-foreground outline-none px-0"
          autoFocus
        />
      ) : (
        <h2
          className={`text-4xl font-bold text-foreground ${
            isEditMode ? 'cursor-text hover:text-accent transition-colors' : ''
          }`}
          onDoubleClick={() => isEditMode && setIsEditing(true)}
        >
          {label.text}
        </h2>
      )}
    </div>
  );

  if (isEditMode) {
    return (
      <Rnd
        position={{ x: label.x, y: label.y }}
        size={{ width: 'auto', height: 'auto' }}
        onDragStop={(e, d) => {
          onUpdate(label.id, { x: d.x, y: d.y });
        }}
        enableResizing={false}
        bounds="parent"
        scale={scale}
        dragHandleClassName="drag-handle"
      >
        <div className="drag-handle cursor-move">
          {content}
        </div>
      </Rnd>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: label.x,
        top: label.y,
      }}
    >
      {content}
    </div>
  );
};
