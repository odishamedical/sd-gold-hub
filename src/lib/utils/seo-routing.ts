import { Shop, Product } from '@/types/gold-hub';

/**
 * Creates a URL-friendly slug from a string.
 */
function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

/**
 * Generates an SEO-friendly slug for a shop.
 * Format: [shop-name]-[city]-[id]
 */
export function generateShopSlug(shop: Shop | any): string {
  if (!shop || !shop.id) return '';
  
  const name = slugify(shop.name || 'gold-shop');
  const city = slugify(shop.location?.district || shop.location?.city || 'india');
  
  return `${name}-${city}-${shop.id}`;
}

/**
 * Generates an SEO-friendly slug for a product.
 * Format: [category]-[purity]-[title]-[id]
 */
export function generateProductSlug(product: Product | any): string {
  if (!product || !product.id) return '';
  
  const category = slugify(product.categoryId || 'jewellery');
  const purity = slugify(product.purity || 'gold');
  const title = slugify(product.title || 'masterpiece');
  
  return `${category}-${purity}-${title}-${product.id}`;
}

/**
 * Extracts the raw Firebase ID from a slug.
 * Since the ID is always appended at the end after a hyphen,
 * we just split by hyphen and take the last segment.
 * If there are no hyphens (e.g. old URL), it just returns the full string.
 */
export function extractIdFromSlug(slug: string): string {
  if (!slug) return '';
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
