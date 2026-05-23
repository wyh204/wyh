export default function SkeletonLoader() {
  return (
    <div className="glass-card p-6 animate-pulse space-y-4">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-5/6" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-1/4 mt-6" />
    </div>
  );
}
