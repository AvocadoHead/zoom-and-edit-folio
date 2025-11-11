export interface MediaItem {
  id: string;
  type: 'gdrive' | 'local';
  driveId?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  title: string;
  description: string;
}

export interface CategoryLabel {
  id: string;
  text: string;
  x: number;
  y: number;
}

export const mediaItems: MediaItem[] = [
  {
    id: 'item-1',
    type: 'local',
    src: '/placeholder.svg',
    x: 100,
    y: 100,
    width: 400,
    title: 'Project One',
    description: 'A beautiful artwork showcasing minimalist design',
  },
  {
    id: 'item-2',
    type: 'local',
    src: '/placeholder.svg',
    x: 600,
    y: 100,
    width: 350,
    title: 'Project Two',
    description: 'Exploring abstract concepts through visual media',
  },
  {
    id: 'item-3',
    type: 'local',
    src: '/placeholder.svg',
    x: 100,
    y: 500,
    width: 450,
    title: 'Project Three',
    description: 'Digital art meets traditional techniques',
  },
];

export const categories: CategoryLabel[] = [
  {
    id: 'cat-1',
    text: 'Digital Art',
    x: 100,
    y: 50,
  },
  {
    id: 'cat-2',
    text: 'Photography',
    x: 600,
    y: 50,
  },
];
