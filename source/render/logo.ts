import { brand } from '../brand/tokens';

export type LogoVariant = 'black' | 'white';
export type LogoZone = typeof brand.logo.allowedZones[number];

export type LogoAsset = {
  black: CanvasImageSource;
  white: CanvasImageSource;
};

export type LogoPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
  zone: LogoZone;
  variant: LogoVariant;
};

export function chooseLogoVariant(background: 'light' | 'dark'): LogoVariant {
  return background === 'dark' ? 'white' : 'black';
}

export function drawApprovedLogo(
  ctx: CanvasRenderingContext2D,
  assets: LogoAsset,
  placement: LogoPlacement,
): void {
  if (!brand.logo.allowedZones.includes(placement.zone)) {
    throw new Error(`Logo zone ${placement.zone} is not approved.`);
  }

  const image = assets[placement.variant];
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.filter = 'none';
  ctx.drawImage(image, placement.x, placement.y, placement.width, placement.height);
  ctx.restore();
}

// Templates must provide a solid, non-photographic logo zone. This helper
// intentionally does not draw circles, pills, cards, shadows or other backing
// devices behind the logo.
export function logoClearSpace(width: number): number {
  return Math.round(width * brand.logo.minimumClearSpaceRatio);
}
