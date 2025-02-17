export const formatTime = (h: number, m: number) => {
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};
