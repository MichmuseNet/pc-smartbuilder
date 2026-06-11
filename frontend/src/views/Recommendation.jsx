import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ReactMarkdown from 'react-markdown';
//Formulario de recomendación de PC que guía al usuario a través de un proceso de selección de uso, presupuesto, preferencias de marca y especificaciones avanzadas, con integración al backend para generar recomendaciones personalizadas basadas en sus respuestas, y muestra los resultados en formato Markdown con estilos modernos utilizando Tailwind CSS
const Recommendation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    use_case: '',
    budget: '',
    preferred_brand: '',
    resolution: '',
    target_fps: '',
    advanced: false,
    ram: '',
    gpu: '',
    cpu: '',
    storage: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/recommendations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
          budget: parseFloat(formData.budget),
          target_fps: parseInt(formData.target_fps) || 0
        })
      });

      if (!res.ok) throw new Error('Error al generar recomendación');
      const data = await res.json();
      setResult(data.result);
      setStep(3);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
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

        {/* Step 1 — Formulario básico */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Arma tu PC ideal</h2>
            <p className="text-gray-400 mb-8">Cuéntanos para qué la vas a usar</p>

            <form className="flex flex-col gap-5">

              <div>
                <label className="text-sm text-gray-400 mb-2 block">¿Para qué usarás la PC?</label>
                <select
                  name="use_case"
                  onChange={handleChange}
                  value={formData.use_case}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="gaming">Gaming</option>
                  <option value="programacion">Programación</option>
                  <option value="diseño">Diseño gráfico</option>
                  <option value="arquitectura">Arquitectura / CAD</option>
                  <option value="oficina">Trabajo de oficina</option>
                  <option value="edicion">Edición de video</option>
                  <option value="cotidiano">Uso cotidiano</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Presupuesto aproximado (USD)</label>
                <input
                  name="budget"
                  type="number"
                  placeholder="Ej: 800"
                  onChange={handleChange}
                  value={formData.budget}
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Marca de preferencia</label>
                <select
                  name="preferred_brand"
                  onChange={handleChange}
                  value={formData.preferred_brand}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sin preferencia</option>
                  <option value="AMD">AMD</option>
                  <option value="Intel">Intel</option>
                  <option value="NVIDIA">NVIDIA</option>
                </select>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg border border-gray-700">
                <input
                  type="checkbox"
                  name="advanced"
                  id="advanced"
                  onChange={handleChange}
                  checked={formData.advanced}
                  className="w-4 h-4"
                />
                <label htmlFor="advanced" className="text-sm text-gray-300">
                  Tengo conocimientos técnicos y quiero especificar componentes
                </label>
              </div>

              <button
                type="button"
                onClick={() => formData.advanced ? setStep(2) : handleSubmit({ preventDefault: () => {} })}
                disabled={!formData.use_case || !formData.budget}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-2"
              >
                {formData.advanced ? 'Siguiente →' : 'Generar recomendación'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 — Formulario avanzado */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Especificaciones avanzadas</h2>
            <p className="text-gray-400 mb-8">Todos los campos son opcionales</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Resolución objetivo</label>
                  <select
                    name="resolution"
                    onChange={handleChange}
                    value={formData.resolution}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">No especificada</option>
                    <option value="1080p">1080p</option>
                    <option value="1440p">1440p</option>
                    <option value="4K">4K</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">FPS objetivo</label>
                  <input
                    name="target_fps"
                    type="number"
                    placeholder="Ej: 144"
                    onChange={handleChange}
                    value={formData.target_fps}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">RAM mínima</label>
                  <input
                    name="ram"
                    type="text"
                    placeholder="Ej: 16GB DDR4"
                    onChange={handleChange}
                    value={formData.ram}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Almacenamiento</label>
                  <input
                    name="storage"
                    type="text"
                    placeholder="Ej: 1TB SSD"
                    onChange={handleChange}
                    value={formData.storage}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">GPU preferida</label>
                  <input
                    name="gpu"
                    type="text"
                    placeholder="Ej: RTX 4070"
                    onChange={handleChange}
                    value={formData.gpu}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">CPU preferida</label>
                  <input
                    name="cpu"
                    type="text"
                    placeholder="Ej: Ryzen 7 7700X"
                    onChange={handleChange}
                    value={formData.cpu}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  ← Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Generando...' : 'Generar recomendación'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3 — Resultados */}
        {step === 3 && result && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Tu configuración ideal ✅</h2>
            <p className="text-gray-400 mb-8">Basada en tus preferencias y presupuesto</p>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <ReactMarkdown
                components={{
                  h2: (props) => (
                    <h2 className="text-xl font-bold text-white mt-6 mb-3">{props.children}</h2>
                  ),
                  h3: (props) => (
                    <h3 className="text-lg font-bold text-blue-400 mt-6 mb-2">{props.children}</h3>
                  ),
                  strong: (props) => (
                    <strong className="text-white font-semibold">{props.children}</strong>
                  ),
                  ul: (props) => (
                    <ul className="list-disc list-inside space-y-1 text-gray-300 ml-2">{props.children}</ul>
                  ),
                  li: (props) => (
                    <li className="text-gray-300 text-sm leading-relaxed">{props.children}</li>
                  ),
                  p: (props) => (
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{props.children}</p>
                  ),
                  a: (props) => (
                    <a
                      href={props.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {props.children}
                    </a>
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setStep(1); setResult(null); }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Nueva búsqueda
              </button>
              <button
                onClick={() => navigate('/history')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Ver historial
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-700">
              <div className="text-4xl mb-4 animate-pulse">🤖</div>
              <p className="text-white font-bold">Analizando tu perfil...</p>
              <p className="text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Recommendation;