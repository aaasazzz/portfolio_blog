import { api } from './api';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const IMAGE_ACCEPT = IMAGE_TYPES.join(',');

export async function uploadImage(file: File) {
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error('PNG, JPEG, GIF, WebP 이미지만 올릴 수 있어요.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('이미지는 5MB 이하만 올릴 수 있어요.');
  }
  const { url } = await api.uploadImage(file);
  return url;
}

export function imageAlt(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '').replace(/[[\]]/g, '') || '이미지';
}
