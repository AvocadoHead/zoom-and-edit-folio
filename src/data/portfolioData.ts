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
    id: 'motion-1',
    type: 'gdrive',
    driveId: '1RtaC8v_khkGuP-NSqkrgTF4GpSCJx8Bi',
    x: 50,
    y: 50,
    width: 300,
    title: 'Motion Design Project 1',
    description: 'Elegant motion design showcasing smooth animations and transitions'
  },
  {
    id: 'motion-2',
    type: 'gdrive',
    driveId: '1xhLV53k70XdmPY5moNGOwjTX1QtC82D1',
    x: 400,
    y: 50,
    width: 300,
    title: 'Motion Design Project 2',
    description: 'Creative motion graphics with professional animation techniques'
  },
  {
    id: 'motion-3',
    type: 'gdrive',
    driveId: '1FV0lEZqs8LowKHbSTNqBEC_-Rtg2stXJ',
    x: 750,
    y: 50,
    width: 300,
    title: 'Motion Design Project 3',
    description: 'Complex motion sequences demonstrating advanced animation principles'
  },
  {
    id: 'motion-4',
    type: 'gdrive',
    driveId: '1m-1MKGzPd41cwYrQ6zvh0LSc0h1up-G4',
    x: 50,
    y: 400,
    width: 300,
    title: 'Motion Design Project 4',
    description: 'Subtle and elegant motion design with nuanced movements'
  },
  {
    id: 'motion-5',
    type: 'gdrive',
    driveId: '1mE4YdRJnfEazdDrAkms7Y6AcbV6qSxds',
    x: 400,
    y: 400,
    width: 300,
    title: 'Motion Design Project 5',
    description: 'Dynamic motion graphics combining multiple animation styles'
  },
  {
    id: 'motion-6',
    type: 'gdrive',
    driveId: '1C6W26MkF4TdkGaqXRw4WwwE0RZyxR4ZA',
    x: 750,
    y: 400,
    width: 300,
    title: 'Motion Design Project 6',
    description: 'Professional motion design for brand storytelling'
  }
];

export const categories: CategoryLabel[] = [
  {
    id: 'cat-motion',
    text: 'Motion Design',
    x: 50,
    y: 0
  }
];
