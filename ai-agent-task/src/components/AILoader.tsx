export default function AILoader() {
  return (
    <div className="flex items-center gap-2 p-2">
      <span className="animate-pulse h-3 w-3 rounded-full bg-gray-400"></span>
      <span className="animate-pulse h-3 w-3 rounded-full bg-gray-400 delay-150"></span>
      <span className="animate-pulse h-3 w-3 rounded-full bg-gray-400 delay-300"></span>
      <span className="pl-3 text-gray-400 text-sm">Thinking...</span>
    </div>
  );
}
