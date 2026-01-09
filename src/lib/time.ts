export const toMinutes = (date: Date) =>
  date.getHours() * 60 + date.getMinutes();

export const diffMinutes = (a: Date, b: Date) =>
  Math.max(0, Math.floor((b.getTime() - a.getTime()) / 60000));
