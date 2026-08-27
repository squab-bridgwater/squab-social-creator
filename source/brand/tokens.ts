export const brand = {
  colours: {
    orange: '#f4941e',
    orangeDark: '#e95822',
    orangeMid: '#fabd75',
    orangeSoft: '#fddfb7',
    black: '#000000',
    charcoal: '#313131',
    grey: '#d2d2d2',
    white: '#ffffff',
  } as Record<'orange' | 'orangeDark' | 'orangeMid' | 'orangeSoft' | 'black' | 'charcoal' | 'grey' | 'white', string>,
  gradient: ['#f4941e', '#e95822'] as const,
  font: {
    family: 'Lato, Arial, sans-serif',
    titleWeight: 900,
    headingWeight: 700,
    bodyWeight: 400,
  },
  artwork: {
    portrait: { width: 1080, height: 1350 },
    square: { width: 1080, height: 1080 },
    linkedin: { width: 1200, height: 1200 },
  },
  logo: {
    // Keep logo treatment controlled in one place. Templates should call the
    // shared logo renderer rather than drawing a backing device themselves.
    minimumClearSpaceRatio: 0.2,
    allowedZones: ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const,
    forbidDirectPhotoPlacement: true,
    forbidEffects: true,
    forbidBackingShapes: true,
  },
} as const;

export type Brand = typeof brand;
