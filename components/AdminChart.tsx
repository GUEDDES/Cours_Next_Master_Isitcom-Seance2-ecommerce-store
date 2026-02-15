export default function AdminChart() {
  return (
    <div className="p-6 bg-white rounded-lg shadow mt-8">
      <h3 className="text-lg font-bold mb-4">Statistiques des Ventes (Graphique)</h3>
      <div className="h-64 bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 rounded">
        <p className="text-gray-500">Graphique charge dynamiquement (Lazy Loaded)</p>
      </div>
    </div>
  );
}
