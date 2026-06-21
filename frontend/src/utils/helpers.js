import { formatDistanceToNow } from 'date-fns';

/** Returns a default avatar URL from username */
export const getAvatarUrl = (username, size = 80) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=2563eb&color=fff&size=${size}`;

/** Formats post timestamp as relative time */
export const formatTimeAgo = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

/** Reads image file and returns base64 data URL */
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
