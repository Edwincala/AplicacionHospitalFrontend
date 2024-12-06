import { useEffect, useState } from "react";
import { Medicamento, useMedicamentosStore } from "../store/medicamentosStore";


export const Medicamentos: React.FC = () => {

  const { 
    medicamentos, 
    loading, 
    error, 
    fetchMedicamentos,
    buscarMedicamentosPorNombre,
    buscarMedicamentosPorLaboratorio,
    buscarPorRangoDePrecio,
    crearOModificarMedicamento,
    eliminarMedicamento 
  } = useMedicamentosStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [labSearchTerm, setLabSearchTerm] = useState('');
  const [selectedMedicamento, setSelectedMedicamento] = useState<Medicamento | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Medicamento, 'id'> & { id?: string }>({
    nombre: '',
    descripcion: '',
    cantidadEnStock: 0,
    laboratorio: '',
    precio: 0,
    urlImagen: null
  });

  useEffect(() => {
    fetchMedicamentos();
  }, [fetchMedicamentos]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      buscarMedicamentosPorNombre(searchTerm);
    } else {
      fetchMedicamentos();
    }
  };

  const handleLabSearch = (ascendente: boolean) => {
    if (labSearchTerm.trim()) {
      buscarMedicamentosPorLaboratorio(labSearchTerm, ascendente);
    }
  };

  const handlePriceSearch = () => {
    if (priceRange.min && priceRange.max) {
      buscarPorRangoDePrecio(Number(priceRange.min), Number(priceRange.max));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await crearOModificarMedicamento(formData);
    if (success) {
      fetchMedicamentos();
      setShowForm(false);
      setSelectedMedicamento(null);
      setFormData({
        nombre: '',
        descripcion: '',
        cantidadEnStock: 0,
        laboratorio: '',
        precio: 0,
        urlImagen: null
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este medicamento?')) {
      const success = await eliminarMedicamento(id);
      if (success) {
        fetchMedicamentos();
      }
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Medicamentos</h1>

      {/* Search and Create Section */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setSelectedMedicamento(null);
              setFormData({
                nombre: '',
                descripcion: '',
                cantidadEnStock: 0,
                laboratorio: '',
                precio: 0,
                urlImagen: null
              });
              setShowForm(true);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Nuevo
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por laboratorio..."
            value={labSearchTerm}
            onChange={(e) => setLabSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={() => handleLabSearch(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Buscar (A-Z)
          </button>
          <button
            onClick={() => handleLabSearch(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Buscar (Z-A)
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Precio mínimo"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-32 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio máximo"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-32 p-2 border rounded"
          />
          <button
            onClick={handlePriceSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Buscar por precio
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedMedicamento ? 'Editar' : 'Nuevo'} Medicamento
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Cantidad en Stock"
                value={formData.cantidadEnStock}
                onChange={(e) => setFormData({ ...formData, cantidadEnStock: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                placeholder="Laboratorio"
                value={formData.laboratorio}
                onChange={(e) => setFormData({ ...formData, laboratorio: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                placeholder="URL de la imagen"
                value={formData.urlImagen || ''}
                onChange={(e) => setFormData({ ...formData, urlImagen: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {selectedMedicamento ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <p>Cargando medicamentos...</p>
        </div>
      ) : medicamentos && medicamentos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicamentos.map((medicamento) => (
            <div key={medicamento.id} className="border rounded-lg p-4 shadow">
              {medicamento.urlImagen && (
                <img
                  src={medicamento.urlImagen}
                  alt={medicamento.nombre}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h3 className="text-lg font-bold mb-2">{medicamento.nombre}</h3>
              <p className="text-sm mb-2">{medicamento.descripcion}</p>
              <p className="text-sm">Laboratorio: {medicamento.laboratorio}</p>
              <p className="text-sm">Stock: {medicamento.cantidadEnStock}</p>
              <p className="text-lg font-bold mt-2">${medicamento.precio}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedMedicamento(medicamento);
                    setFormData(medicamento);
                    setShowForm(true);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(medicamento.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No hay medicamentos disponibles</p>
        </div>
      )}
    </div>
  )
}