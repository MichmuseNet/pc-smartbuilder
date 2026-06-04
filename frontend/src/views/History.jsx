import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ReactMarkdown from 'react-markdown';

const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [compatibility, setCompatibility] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const [recRes, diagRes, compRes] = await Promise.all([
          fetch(`${API_BASE_URL}/recommendations/user/${user.id}`),
          fetch(`${API_BASE_URL}/diagnostics/user/${user.id}`),
          fetch(`${API_BASE_URL}/compatibility/user/${user.id}`)
        ]);

        const recData = await recRes.json();
        const diagData = await diagRes.json();
        const compData = await compRes.json();

        setRecommendations(Array.isArray(recData) ? recData : []);
        setDiagnostics(Array.isArray(diagData) ? diagData : []);
        setCompatibility(Array.isArray(compData) ? compData : []);
      } catch (error) {
        console.error('Error cargando historial:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) fetchHistory();
  }, [user.id]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const tabs = [
    { id: 'recommendations', label: '🖥️ Recomendaciones', count: recommendations.length },
    { id: 'diagnostics', label: '⚡ Diagnósticos', count: diagnostics.length },
    { id: 'compatibility', label: '🔍 Compatibilidad', count: compatibility.length }
  ];

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

      <div className="max-w-3xl mx-auto px-8 py-12">

        <h2 className="text-3xl font-bold mb-2">Mi historial</h2>
        <p className="text-gray-400 mb-8">Todos tus análisis y recomendaciones anteriores</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelected(null); }}
              className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl animate-pulse mb-4">⏳</div>
            <p className="text-gray-400">Cargando historial...</p>
          </div>
        )}

        {/* Detail view */}
        {selected && (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2"
            >
              ← Volver al historial
            </button>

            {activeTab === 'diagnostics' && (
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border bg-gray-900 border-gray-700">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${
                    selected.system_score >= 70 ? 'text-green-400' :
                    selected.system_score >= 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {selected.system_score}
                  </div>
                  <div className="text-xs text-gray-400">/ 100</div>
                </div>
                <div>
                  <p className="text-white font-semibold">Puntuación del sistema</p>
                  <p className="text-gray-400 text-sm">{formatDate(selected.created_at)}</p>
                </div>
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl border ${
                selected.is_compatible
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-red-900/20 border-red-700'
              }`}>
                <span className="text-3xl">{selected.is_compatible ? '✅' : '⚠️'}</span>
                <div>
                  <p className="font-semibold">
                    {selected.is_compatible ? 'Componentes compatibles' : 'Incompatibilidad detectada'}
                  </p>
                  <p className="text-gray-400 text-sm">{formatDate(selected.created_at)}</p>
                </div>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <ReactMarkdown
                components={{
                  h2: (props) => <h2 className="text-xl font-bold text-white mt-6 mb-3">{props.children}</h2>,
                  h3: (props) => <h3 className="text-lg font-bold text-blue-400 mt-4 mb-2">{props.children}</h3>,
                  strong: (props) => <strong className="text-white font-semibold">{props.children}</strong>,
                  ul: (props) => <ul className="list-disc list-inside space-y-1 ml-2">{props.children}</ul>,
                  li: (props) => <li className="text-gray-300 text-sm leading-relaxed">{props.children}</li>,
                  p: (props) => <p className="text-gray-300 text-sm leading-relaxed mb-3">{props.children}</p>,
                  a: function(props) {
                    return (
                      <a href={props.href} target="_blank" rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline">
                        {props.children}
                      </a>
                    );
                  }
                }}
              >
                {selected.result}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* List view */}
        {!loading && !selected && (
          <div className="flex flex-col gap-4">

            {/* Recommendations */}
            {activeTab === 'recommendations' && (
              recommendations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🖥️</div>
                  <p>No tienes recomendaciones aún</p>
                  <button
                    onClick={() => navigate('/recommendation')}
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Generar mi primera recomendación →
                  </button>
                </div>
              ) : (
                recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => setSelected(rec)}
                    className="cursor-pointer bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-5 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white capitalize">
                          PC para {rec.use_case}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Presupuesto: ${rec.budget} USD
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">{formatDate(rec.created_at)}</p>
                        <p className="text-blue-400 text-xs mt-1">Ver detalle →</p>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

            {/* Diagnostics */}
            {activeTab === 'diagnostics' && (
              diagnostics.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">⚡</div>
                  <p>No tienes diagnósticos aún</p>
                  <button
                    onClick={() => navigate('/diagnostics')}
                    className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    Analizar mi PC →
                  </button>
                </div>
              ) : (
                diagnostics.map((diag) => (
                  <div
                    key={diag.id}
                    onClick={() => setSelected(diag)}
                    className="cursor-pointer bg-gray-900 border border-gray-800 hover:border-yellow-500 rounded-xl p-5 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white">
                          {diag.cpu || 'PC analizada'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {diag.os_version} — Score:
                          <span className={`ml-1 font-bold ${
                            diag.system_score >= 70 ? 'text-green-400' :
                            diag.system_score >= 40 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {diag.system_score}/100
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">{formatDate(diag.created_at)}</p>
                        <p className="text-yellow-400 text-xs mt-1">Ver detalle →</p>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

            {/* Compatibility */}
            {activeTab === 'compatibility' && (
              compatibility.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No tienes verificaciones aún</p>
                  <button
                    onClick={() => navigate('/compatibility')}
                    className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Verificar compatibilidad →
                  </button>
                </div>
              ) : (
                compatibility.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => setSelected(comp)}
                    className="cursor-pointer bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white">
                          {comp.cpu || 'Componentes verificados'}
                        </p>
                        <p className={`text-sm mt-1 ${comp.is_compatible ? 'text-green-400' : 'text-red-400'}`}>
                          {comp.is_compatible ? '✅ Compatible' : '⚠️ Incompatible'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">{formatDate(comp.created_at)}</p>
                        <p className="text-purple-400 text-xs mt-1">Ver detalle →</p>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default History;