/**
 * Represents a single item rendered on the portfolio canvas. Items can be
 * sourced from Google Drive, YouTube or provided directly via a URL. When
 * adding additional sources in the future extend the `type` union and
 * update `getMediaSrc` in MediaItem.tsx accordingly.  For Drive hosted
 * media specify the `driveId` and omit `src`. For YouTube hosted media set
 * `type` to `"youtube"` and provide the full embed URL in `src`. Local or
 * remote images/videos can be provided by specifying `type: "local"` and
 * supplying the URL via `src`.
 */
export interface MediaItem {
  /** Unique identifier for this media item */
  id: string;
  /** Source type: 'gdrive' for Google Drive hosted videos, 'youtube' for YouTube embeds, 'local' for other URLs */
  type: 'gdrive' | 'local' | 'youtube';
  /** Google Drive file id (required for gdrive items) */
  driveId?: string;
  /** Direct source URL (required for youtube and local items) */
  src?: string;
  /** X coordinate on the infinite canvas */
  x: number;
  /** Y coordinate on the infinite canvas */
  y: number;
  /** Width of the item in pixels. Height is derived from aspect ratio (4:3) */
  width: number;
  /** Title displayed in edit mode and overlay */
  title: string;
  /** Short description displayed in overlay */
  description: string;
}

export interface CategoryLabel {
  /** Unique id for category label */
  id: string;
  /** Human readable category name */
  text: string;
  /** X coordinate for the label */
  x: number;
  /** Y coordinate for the label */
  y: number;
}

//
// Portfolio media items migrated from the original Eyal Izenman portfolio
// Each row of items corresponds to one of the main categories.  Feel free
// to tweak the x/y positioning and widths to suit your layout.  Items can
// be rearranged in edit mode by visiting the page with ?edit=true.
export const mediaItems: MediaItem[] = [
  // Motion Design videos from motion-design.html
  {
    id: 'motion-1',
    type: 'gdrive',
    driveId: '1RtaC8v_khkGuP-NSqkrgTF4GpSCJx8Bi',
    x: 50,
    y: 80,
    width: 300,
    title: 'Motion Design 1',
    description: 'Selected motion design piece from the original portfolio'
  },
  {
    id: 'motion-2',
    type: 'gdrive',
    driveId: '1xhLV53k70XdmPY5moNGOwjTX1QtC82D1',
    x: 400,
    y: 80,
    width: 300,
    title: 'Motion Design 2',
    description: 'Selected motion design piece from the original portfolio'
  },
  {
    id: 'motion-3',
    type: 'gdrive',
    driveId: '1FV0lEZqs8LowKHbSTNqBEC_-Rtg2stXJ',
    x: 750,
    y: 80,
    width: 300,
    title: 'Motion Design 3',
    description: 'Selected motion design piece from the original portfolio'
  },
  {
    id: 'motion-4',
    type: 'gdrive',
    driveId: '1m-1MKGzPd41cwYrQ6zvh0LSc0h1up-G4',
    x: 1100,
    y: 80,
    width: 300,
    title: 'Motion Design 4',
    description: 'Selected motion design piece from the original portfolio'
  },
  {
    id: 'motion-5',
    type: 'gdrive',
    driveId: '1mE4YdRJnfEazdDrAkms7Y6AcbV6qSxds',
    x: 1450,
    y: 80,
    width: 300,
    title: 'Motion Design 5',
    description: 'Selected motion design piece from the original portfolio'
  },
  {
    id: 'motion-6',
    type: 'gdrive',
    driveId: '1C6W26MkF4TdkGaqXRw4WwwE0RZyxR4ZA',
    x: 1800,
    y: 80,
    width: 300,
    title: 'Motion Design 6',
    description: 'Selected motion design piece from the original portfolio'
  },

  // Deep Fake videos from deepfake.html
  {
    id: 'deepfake-1',
    type: 'gdrive',
    driveId: '1yGnrcMFuJOVR45oz-Y64xkkOM47oDgqv',
    x: 50,
    y: 430,
    width: 300,
    title: 'Deep Fake 1',
    description: 'Deepfake exploration of reality and illusion'
  },
  {
    id: 'deepfake-2',
    type: 'gdrive',
    driveId: '1o_HFdXg9hyrC_r5wg43rTpem0swX4kql',
    x: 400,
    y: 430,
    width: 300,
    title: 'Deep Fake 2',
    description: 'Deepfake exploration of reality and illusion'
  },
  {
    id: 'deepfake-3',
    type: 'gdrive',
    driveId: '17E-XP8B_kU9yzJ2kHwGKR7l9vSb4-gxd',
    x: 750,
    y: 430,
    width: 300,
    title: 'Deep Fake 3',
    description: 'Deepfake exploration of reality and illusion'
  },
  {
    id: 'deepfake-4',
    type: 'gdrive',
    driveId: '1odRDN1r1hPxISH_wxgCXrUI5fb28vEsB',
    x: 1100,
    y: 430,
    width: 300,
    title: 'Deep Fake 4',
    description: 'Deepfake exploration of reality and illusion'
  },
  {
    id: 'deepfake-5',
    type: 'gdrive',
    driveId: '1WwdybbS7Xfm3hOvqjJqS5Bb5PThVcv3h',
    x: 1450,
    y: 430,
    width: 300,
    title: 'Deep Fake 5',
    description: 'Deepfake exploration of reality and illusion'
  },
  {
    id: 'deepfake-6',
    type: 'gdrive',
    driveId: '1qLjMvdb46Ko7o6-eiQxiuxAy9gETIXBL',
    x: 1800,
    y: 430,
    width: 300,
    title: 'Deep Fake 6',
    description: 'Deepfake exploration of reality and illusion'
  },

  // Animation pieces from animation.html
  {
    id: 'animation-1',
    type: 'gdrive',
    driveId: '1Gw18guzbDMjD0Ckk6RMeYdZjxCPm1wWn',
    x: 50,
    y: 780,
    width: 300,
    title: 'Animation 1',
    description: 'Animation experiment stretching the essence of a moment'
  },
  {
    id: 'animation-2',
    type: 'gdrive',
    driveId: '1NyBJnf5W1UMhvuF9NZN8kmZNGlO1hdnR',
    x: 400,
    y: 780,
    width: 300,
    title: 'Animation 2',
    description: 'Animation experiment stretching the essence of a moment'
  },
  {
    id: 'animation-3',
    type: 'gdrive',
    driveId: '1Ar_xb6SthsNCYzFefxPlE7t4XxbCtSTF',
    x: 750,
    y: 780,
    width: 300,
    title: 'Animation 3',
    description: 'Animation experiment stretching the essence of a moment'
  },

  // Generative videos (YouTube and Drive) from generative-video.html
  {
    id: 'genvid-1',
    type: 'youtube',
    src: 'https://www.youtube.com/embed/z97tQM8zSrc?autoplay=1',
    x: 50,
    y: 1130,
    width: 300,
    title: 'Generative Video 1',
    description: 'Generative video exploring memes and pop culture'
  },
  {
    id: 'genvid-2',
    type: 'youtube',
    src: 'https://www.youtube.com/embed/nfn1QE36Ih0?autoplay=1',
    x: 400,
    y: 1130,
    width: 300,
    title: 'Generative Video 2',
    description: 'Generative video exploring memes and pop culture'
  },
  {
    id: 'genvid-3',
    type: 'youtube',
    src: 'https://www.youtube.com/embed/ehxLqScw_Lw?autoplay=1',
    x: 750,
    y: 1130,
    width: 300,
    title: 'Generative Video 3',
    description: 'Generative video exploring memes and pop culture'
  },
  {
    id: 'genvid-4',
    type: 'gdrive',
    driveId: '1u3ct7IUg4KBzTxypVi6MWcp8FnpeEEXB',
    x: 1100,
    y: 1130,
    width: 300,
    title: 'Generative Video 4',
    description: 'Generative video exploring memes and pop culture'
  },

  // Design works from design.html (subset)
  {
    id: 'design-1',
    type: 'gdrive',
    driveId: '1rPOThjVaocfBd0b2ebJN-TCzBqeieGbK',
    x: 50,
    y: 1480,
    width: 300,
    title: 'Design 1',
    description: 'Visual design exploration from the original portfolio'
  },
  {
    id: 'design-2',
    type: 'gdrive',
    driveId: '1vNC_6AEXL64QKXk9Iba8xumHrATDW3uH',
    x: 400,
    y: 1480,
    width: 300,
    title: 'Design 2',
    description: 'Visual design exploration from the original portfolio'
  },
  {
    id: 'design-3',
    type: 'gdrive',
    driveId: '1ge2G8zcSVtx3uh9sJCgdymM3WSiBbvbG',
    x: 750,
    y: 1480,
    width: 300,
    title: 'Design 3',
    description: 'Visual design exploration from the original portfolio'
  },
  {
    id: 'design-4',
    type: 'gdrive',
    driveId: '1p_l53DTeNuOpD8I-44ISzzHSW-UOkVoJ',
    x: 1100,
    y: 1480,
    width: 300,
    title: 'Design 4',
    description: 'Visual design exploration from the original portfolio'
  }
];

// Labels for each category row on the canvas.  Adjust the x/y positions to
// reposition categories relative to their media items.
export const categories: CategoryLabel[] = [
  {
    id: 'cat-motion',
    text: 'Motion Design',
    x: 50,
    y: 40
  },
  {
    id: 'cat-deepfake',
    text: 'Deep Fake',
    x: 50,
    y: 390
  },
  {
    id: 'cat-animation',
    text: 'Animation',
    x: 50,
    y: 740
  },
  {
    id: 'cat-generative',
    text: 'Generative Video',
    x: 50,
    y: 1090
  },
  {
    id: 'cat-design',
    text: 'Design',
    x: 50,
    y: 1440
  }
];
