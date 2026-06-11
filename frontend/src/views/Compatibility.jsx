import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ReactMarkdown from 'react-markdown';
//Formulario de verificación de compatibilidad de componentes de PC, que permite al usuario ingresar o seleccionar sus componentes actuales o planeados, y luego envía esta información al backend para recibir un análisis detallado de compatibilidad, mostrando los resultados en formato Markdown con estilos modernos utilizando Tailwind CSS, e incluyendo explicaciones y recomendaciones para resolver cualquier problema de incompatibilidad detectado
const componentOptions = {
  cpu: [
    'Intel Core i3-12100',
    'Intel Core i5-12400',
    'Intel Core i5-13600K',
    'Intel Core i7-13700K',
    'Intel Core i9-13900K',
    'AMD Ryzen 5 5600X',
    'AMD Ryzen 5 7600X',
    'AMD Ryzen 7 7700X',
    'AMD Ryzen 9 7900X',
    'AMD Ryzen 9 7950X',
  ],
  gpu: [
    'NVIDIA GeForce GTX 1660 Super',
    'NVIDIA GeForce RTX 3060',
    'NVIDIA GeForce RTX 3070',
    'NVIDIA GeForce RTX 4060',
    'NVIDIA GeForce RTX 4070',
    'NVIDIA GeForce RTX 4080',
    'AMD Radeon RX 6600',
    'AMD Radeon RX 6700 XT',
    'AMD Radeon RX 7800 XT',
    'AMD Radeon RX 7900 XTX',
  ],
  ram: [
    '8GB DDR4 3200MHz',
    '16GB DDR4 3200MHz',
    '32GB DDR4 3600MHz',
    '16GB DDR5 5200MHz',
    '32GB DDR5 5600MHz',
    '64GB DDR5 6000MHz',
  ],
  motherboard: [
    'ASUS ROG Strix B550-F',
    'ASUS ROG Z790-F',
    'MSI MAG B550 Tomahawk',
    'MSI MPG Z790 Edge',
    'Gigabyte B550 Aorus Pro',
    'ASRock B650E Taichi',
    'ASRock X670E Taichi',
  ],
  psu: [
    'Corsair 550W 80+ Bronze',
    'Corsair 650W 80+ Gold',
    'Corsair 750W 80+ Gold',
    'EVGA 650W 80+ Gold',
    'EVGA 850W 80+ Gold',
    'Seasonic 750W 80+ Platinum',
  ],
  storage: [
    'Samsung 500GB SSD SATA',
    'Samsung 1TB NVMe SSD',
    'Samsung 2TB NVMe SSD',
    'Western Digital 1TB HDD',
    'Western Digital 2TB HDD',
    'Seagate 1TB NVMe SSD',
  ]
};

const helpText = {
  cpu: 'El procesador es el cerebro de tu PC. Intel y AMD son las dos marcas principales.',
  gpu: 'La tarjeta gráfica procesa las imágenes. Es el componente más importante para gaming.',
  ram: 'La memoria RAM determina cuántas tareas puede hacer tu PC al mismo tiempo.',
  motherboard: 'La tarjeta madre conecta todos los componentes. Debe ser compatible con tu CPU.',
  psu: 'La fuente de poder alimenta todos los componentes. Debe tener suficientes watts.',
  storage: 'El almacenamiento guarda tus archivos. Los SSD son más rápidos que los HDD.'
};

const fieldLabels = {
  cpu: 'CPU (Procesador)',
  gpu: 'GPU (Tarjeta gráfica)',
  ram: 'RAM (Memoria)',
  motherboard: 'Motherboard (Tarjeta madre)',
  psu: 'PSU (Fuente de poder)',
  storage: 'Storage (Almacenamiento)'
};

const Compatibility = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeHelp, setActiveHelp] = useState(null);
  const [formData, setFormData] = useState({
    cpu: '',
    gpu: '',
    ram: '',
    motherboard: '',
    psu: '',
    storage: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleHelp = (field) => {
    setActiveHelp(activeHelp === field ? null : field);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/compatibility/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user.id
        })
      });

      if (!res.ok) throw new Error('Error al verificar compatibilidad');
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PC SmartBuilder</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">

        {!result ? (
          <div>
            <h2 className="text-3xl font-bold mb-2">Verificar compatibilidad</h2>
            <p className="text-gray-400 mb-8">
              Ingresa los componentes que tienes o planeas comprar
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {Object.keys(formData).map((field) => (
                <div key={field}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">{fieldLabels[field]}</label>
                    <button
                      type="button"
                      onClick={() => toggleHelp(field)}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {activeHelp === field ? 'Cerrar ayuda ✕' : '¿Qué es esto? 💡'}
                    </button>
                  </div>

                  {activeHelp === field && (
                    <div className="mb-2 p-3 rounded-lg bg-purple-900/20 border border-purple-700 text-purple-300 text-xs">
                      {helpText[field]}
                    </div>
                  )}

                  <input
                    name={field}
                    type="text"
                    placeholder={`Escribe o selecciona abajo`}
                    onChange={handleChange}
                    value={formData[field]}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-purple-500 mb-2"
                  />

                  <div className="flex flex-wrap gap-2">
                    {componentOptions[field].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelect(field, option)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          formData[field] === option
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-purple-500 hover:text-white'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading || (!formData.cpu && !formData.gpu && !formData.ram)}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-2"
              >
                {loading ? 'Analizando...' : 'Verificar compatibilidad'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className={result.is_compatible ? "flex items-center gap-3 mb-6 p-4 rounded-xl border bg-green-900/20 border-green-700" : "flex items-center gap-3 mb-6 p-4 rounded-xl border bg-red-900/20 border-red-700"}>
              <span className="text-3xl">
                {result.is_compatible ? '✅' : '⚠️'}
              </span>
              <div>
                <h2 className="text-xl font-bold">
                  {result.is_compatible ? 'Componentes compatibles' : 'Incompatibilidad detectada'}
                </h2>
                <p className={`text-sm ${result.is_compatible ? 'text-green-400' : 'text-red-400'}`}>
                  {result.is_compatible
                    ? 'Tu configuración es compatible'
                    : 'Se encontraron problemas de compatibilidad'}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <ReactMarkdown
                components={{
                  h2: (props) => (
                    <h2 className="text-xl font-bold text-white mt-6 mb-3">{props.children}</h2>
                  ),
                  h3: (props) => (
                    <h3 className="text-lg font-bold text-purple-400 mt-4 mb-2">{props.children}</h3>
                  ),
                  strong: (props) => (
                    <strong className="text-white font-semibold">{props.children}</strong>
                  ),
                  ul: (props) => (
                    <ul className="list-disc list-inside space-y-1 ml-2">{props.children}</ul>
                  ),
                  li: (props) => (
                    <li className="text-gray-300 text-sm leading-relaxed">{props.children}</li>
                  ),
                  p: (props) => (
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{props.children}</p>
                  ),
                }}
              >
                {result.result}
              </ReactMarkdown>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setResult(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Nueva verificación
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-700">
              <div className="text-4xl mb-4 animate-pulse">🔍</div>
              <p className="text-white font-bold">Analizando compatibilidad...</p>
              <p className="text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Compatibility;