const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;

export function publicationTime(now: Date, publishedAt: Date) {
  const diff = now.getTime() - publishedAt.getTime();
  const minutesAgo = Math.floor(diff / ONE_MINUTE_IN_MILLISECONDS);

  if (minutesAgo < 1) return "Less than a minute ago";
  if (minutesAgo < 2) return "1 minute ago";
  return `${minutesAgo} minutes ago`;
}
