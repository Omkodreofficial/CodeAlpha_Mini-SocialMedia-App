// client/src/utils/formatTime.js
export default function formatTime(unix) {
  if (!unix) return "";

  const seconds = Math.floor(Date.now() / 1000 - unix);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  // Convert to date
  const d = new Date(unix * 1000);
  return d.toLocaleDateString();
}
