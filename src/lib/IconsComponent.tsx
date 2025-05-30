export function BlankCardIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-2 bg-white rounded" />
    </div>
  );
}

export function ImageAndTextIcon() {
  return (
    <div className="w-full h-full flex gap-2">
      <div className="w-1/2 bg-white rounded" />
      <div className="w-1/2 flex flex-col gap-1">
        <div className="h-2 bg-white rounded w-full" />
        <div className="h-2 bg-white rounded w-2/3" />
      </div>
    </div>
  );
}
