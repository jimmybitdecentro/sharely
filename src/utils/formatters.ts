import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatNumber = (num: string | number): string => {
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(n)) return '0';

  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return n.toString();
};

export const formatRelativeDate = (date: string): string => {
  return dayjs(date).fromNow();
};

export const formatFullDate = (date: string): string => {
  return dayjs(date).format('MMM D, YYYY');
};
