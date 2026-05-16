export default function Skeleton() {
  return (
    <div className="animate-pulse flex bg-white rounded-2xl p-3 border border-kuncu-altin/10 shadow-sm gap-3">
      <div className="w-24 h-24 bg-kuncu-altin/10 rounded-xl flex-shrink-0"></div>
      <div className="flex flex-col justify-between flex-grow py-1">
        <div className="space-y-2">
          <div className="h-4 bg-kuncu-altin/10 rounded w-3/4"></div>
          <div className="h-3 bg-kuncu-altin/10 rounded w-full"></div>
        </div>
        <div className="h-4 bg-kuncu-altin/10 rounded w-1/4"></div>
      </div>
    </div>
  );
}