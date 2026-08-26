export function getProxiedImageUrl(url: string | undefined | null, fallback = '/images/showrooms.png'): string {
  if (!url) return fallback;
  if (url.includes('places.googleapis.com') || url.includes('maps.googleapis.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}
