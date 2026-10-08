/**
 * Client-side image optimizer for Firestore persistence.
 *
 * Firestore documents have a strict 1MB limit. This utility compresses
 * images uploaded from device storage (phone, desktop, tablet) into high-quality,
 * ultra-compact Base64 Data URLs (typically 40KB - 250KB) that save reliably
 * inside Firestore documents and collections without needing third-party buckets.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export interface OptimizerOptions {
  maxWidth?: number;
  maxHeight?: number;
  initialQuality?: number;
  maxSizeBytes?: number; // Target max size in bytes (default 500KB to stay safely under Firestore 1MB)
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
  if (!file.type.startsWith('image/') && !validTypes.includes(file.type)) {
    return { valid: false, error: 'Selected file is not an image. Please choose a JPG, PNG, or WebP photo.' };
  }

  // Soft limit check on input raw file (e.g. 25MB)
  if (file.size > 25 * 1024 * 1024) {
    return { valid: false, error: 'Image file is too large (> 25MB). Please choose a smaller image.' };
  }

  return { valid: true };
}

/**
 * Loads a File into an HTMLImageElement
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to decode image from device storage.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from device storage.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image file from device storage to fit cleanly into Firestore.
 */
export async function optimizeImageForFirestore(
  file: File,
  options: OptimizerOptions = {}
): Promise<OptimizedImageResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file');
  }

  const {
    maxWidth = 1400,
    maxHeight = 1400,
    initialQuality = 0.82,
    maxSizeBytes = 520 * 1024 // 520KB safe limit for Firestore docs
  } = options;

  const img = await loadImageFromFile(file);

  let targetWidth = img.naturalWidth || img.width;
  let targetHeight = img.naturalHeight || img.height;

  // Calculate scaled dimensions
  if (targetWidth > maxWidth || targetHeight > maxHeight) {
    const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available for image optimization.');
  }

  // Smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Try WebP first for optimal compression, fallback to JPEG
  let mimeType = 'image/webp';
  let quality = initialQuality;
  let dataUrl = canvas.toDataURL(mimeType, quality);

  // If WebP is not supported by the browser, fallback to JPEG
  if (!dataUrl.startsWith('data:image/webp')) {
    mimeType = 'image/jpeg';
    dataUrl = canvas.toDataURL(mimeType, quality);
  }

  // Estimate binary size from base64 string
  let sizeBytes = Math.round((dataUrl.length * 3) / 4);

  // If still too large for Firestore, compress progressively
  let attempts = 0;
  while (sizeBytes > maxSizeBytes && attempts < 4) {
    attempts++;
    quality = Math.max(0.45, quality - 0.15);

    // Also reduce dimensions if severely oversized
    if (sizeBytes > maxSizeBytes * 1.5) {
      targetWidth = Math.round(targetWidth * 0.8);
      targetHeight = Math.round(targetHeight * 0.8);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    }

    dataUrl = canvas.toDataURL(mimeType, quality);
    sizeBytes = Math.round((dataUrl.length * 3) / 4);
  }

  return {
    dataUrl,
    name: file.name,
    mimeType,
    sizeBytes,
    width: targetWidth,
    height: targetHeight
  };
}
