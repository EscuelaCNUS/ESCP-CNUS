export default function ArticulandoLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] bg-white" role="status">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#0045A5] border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-sm">Cargando artículos...</span>
      </div>
    </div>
  );
}
