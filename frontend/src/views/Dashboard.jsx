import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">PC SmartBuilder</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            Hola, <span className="text-white font-semibold">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          ¿En qué te podemos ayudar?
        </h2>
        <p className="text-gray-400 text-lg mb-16">
          Selecciona la opción que mejor describe tu situación
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Antes de la PC */}
          <div
            onClick={() => navigate('/recommendation')}
            className="cursor-pointer bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 text-left"
          >
            <div className="text-5xl mb-6">🖥️</div>
            <h3 className="text-2xl font-bold mb-3">Quiero armar mi PC</h3>
            <p className="text-gray-400 leading-relaxed">
              No sé qué componentes comprar. Ayúdame a encontrar la configuración 
              ideal según mi presupuesto y para qué la voy a usar.
            </p>
            <div className="mt-6 text-blue-400 font-semibold flex items-center gap-2">
              Comenzar →
            </div>
          </div>

          {/* Verificar compatibilidad */}
          <div
            onClick={() => navigate('/compatibility')}
            className="cursor-pointer bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 text-left"
          >
            <div className="text-5xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-3">Verificar compatibilidad</h3>
            <p className="text-gray-400 leading-relaxed">
              Ya tengo algunos componentes en mente y quiero saber si son compatibles entre sí antes de comprar.
            </p>
            <div className="mt-6 text-purple-400 font-semibold flex items-center gap-2">
              Verificar →
            </div>
          </div>

          {/* Después de la PC */}
          <div
            onClick={() => navigate('/diagnostics')}
            className="cursor-pointer bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 text-left"
          >
            <div className="text-5xl mb-6">🔧</div>
            <h3 className="text-2xl font-bold mb-3">Ya tengo mi PC</h3>
            <p className="text-gray-400 leading-relaxed">
              Ya tengo mi PC pero quiero optimizarla. Analiza mi sistema y 
              dime qué puedo hacer para sacarle el máximo provecho.
            </p>
            <div className="mt-6 text-purple-400 font-semibold flex items-center gap-2">
              Analizar →
            </div>
          </div>

        </div>

        {/* History link */}
        <div className="mt-12">
          <button
            onClick={() => navigate('/history')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Ver mi historial de análisis →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;