/**
 * Dynamically adjusts Unsplash query parameters (width and quality)
 * to serve optimized image sizes, improving site speed and SEO scores.
 * Other image hosts (e.g. Supabase Storage, placedog.net) pass through unchanged.
 */
export function getOptimizedImageUrl(url: string, width: number, quality = 70): string {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    let optimized = url.replace(/w=\d+/, `w=${width}`);
    optimized = optimized.replace(/q=\d+/, `q=${quality}`);
    return optimized;
  }
  return url;
}
