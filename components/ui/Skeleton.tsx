export default function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <Skeleton className="mb-4 h-40 w-full" />
      <Skeleton className="mb-2 h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}
