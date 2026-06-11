import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ReactMarkdown from 'react-markdown';
//Formulario de diagnóstico de PC que permite al usuario ingresar las especificaciones de su sistema, enviar esta información al backend para recibir un análisis detallado del estado de su PC, mostrando una puntuación general y recomendaciones personalizadas en formato Markdown, utilizando Tailwind CSS para el diseño y estilos modernos, e incluyendo una sección de ayuda para que el usuario sepa cómo obtener sus especificaciones fácilmente. Además, se muestra un indicador visual del estado del sistema basado en la puntuación obtenida, con colores y mensajes claros para facilitar la comprensión del resultado. El usuario también tiene la opción de realizar un nuevo análisis o ver su historial de diagnósticos anteriores.
const Diagnostics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    os_version: '',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    extra_info: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/diagnostics/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user.id
        })
      });

      if (!res.ok) throw new Error('Error al analizar el sistema');
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-green-900/20 border-green-700';
    if (score >= 40) return 'bg-yellow-900/20 border-yellow-700';
    return 'bg-red-900/20 border-red-700';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Sistema en buen estado';
    if (score >= 40) return 'Sistema con mejoras pendientes';
    return 'Sistema necesita atención';
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
            <h2 className="text-3xl font-bold mb-2">Analizar mi PC</h2>
            <p className="text-gray-400 mb-8">
              Ingresa las especificaciones de tu PC y te diremos cómo optimizarla
            </p>

            <div className="bg-gray-900 border border-yellow-700/50 rounded-xl p-4 mb-8">
              <p className="text-yellow-400 text-sm font-semibold mb-1">💡 ¿Cómo saber mis especificaciones?</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                En Windows: presiona <span className="text-white font-mono bg-gray-800 px-1 rounded">Win + R</span>, 
                escribe <span className="text-white font-mono bg-gray-800 px-1 rounded">dxdiag</span> y presiona Enter. 
                Ahí encontrarás tu Sistema Operativo, CPU, RAM y GPU.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Sistema Operativo</label>
                <select
                  name="os_version"
                  onChange={handleChange}
                  value={formData.os_version}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Selecciona tu sistema operativo</option>
                  <option value="Windows 11">Windows 11</option>
                  <option value="Windows 10">Windows 10</option>
                  <option value="Windows 8">Windows 8</option>
                  <option value="macOS Ventura">macOS Ventura</option>
                  <option value="macOS Sonoma">macOS Sonoma</option>
                  <option value="Ubuntu 22.04">Ubuntu 22.04</option>
                  <option value="Linux Mint">Linux Mint</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">CPU</label>
                  <input
                    name="cpu"
                    type="text"
                    placeholder="Ej: Intel Core i5-10400"
                    onChange={handleChange}
                    value={formData.cpu}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">GPU</label>
                  <input
                    name="gpu"
                    type="text"
                    placeholder="Ej: GTX 1660 Super"
                    onChange={handleChange}
                    value={formData.gpu}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">RAM</label>
                  <input
                    name="ram"
                    type="text"
                    placeholder="Ej: 16GB DDR4"
                    onChange={handleChange}
                    value={formData.ram}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Almacenamiento</label>
                  <input
                    name="storage"
                    type="text"
                    placeholder="Ej: 500GB SSD + 1TB HDD"
                    onChange={handleChange}
                    value={formData.storage}
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Información adicional (opcional)
                </label>
                <textarea
                  name="extra_info"
                  placeholder="Ej: Mi PC se calienta mucho, los juegos van lentos, tarda mucho en iniciar..."
                  onChange={handleChange}
                  value={formData.extra_info}
                  rows={3}
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-yellow-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.cpu}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-2"
              >
                {loading ? 'Analizando...' : 'Analizar mi PC 🔍'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className={`flex items-center gap-4 mb-8 p-5 rounded-xl border ${getScoreBg(result.system_score)}`}>
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(result.system_score)}`}>
                  {result.system_score}
                </div>
                <div className="text-xs text-gray-400 mt-1">/ 100</div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{getScoreLabel(result.system_score)}</h2>
                <p className={`text-sm mt-1 ${getScoreColor(result.system_score)}`}>
                  Puntuación del sistema
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
                    <h3 className="text-lg font-bold text-yellow-400 mt-4 mb-2">{props.children}</h3>
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
                  a: function (props) {
                    return (
                      <a
                        href={props.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 underline"
                      >
                        {props.children}
                      </a>
                    );
                  },
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
                Nuevo análisis
              </button>
              <button
                onClick={() => navigate('/history')}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Ver historial
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-700">
              <div className="text-4xl mb-4 animate-pulse">⚡</div>
              <p className="text-white font-bold">Analizando tu sistema...</p>
              <p className="text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Diagnostics;