import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PC SmartBuilder</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-white text-sm font-semibold transition-colors"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Registrarse
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-20">
        <div className="text-6xl mb-6">🖥️</div>
        <h2 className="text-5xl font-bold mb-6 max-w-2xl leading-tight">
          Arma la PC perfecta para ti
        </h2>
        <p className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10">
          Te ayudamos a elegir los mejores componentes según tu presupuesto y necesidades,
          o a optimizar la PC que ya tienes.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg"
          >
            Comenzar gratis
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg"
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-800 px-8 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-bold mb-2">Recomendaciones con IA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nuestro sistema analiza tus necesidades y presupuesto para recomendarte
              la configuración ideal.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold mb-2">Verificación de compatibilidad</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Verifica si tus componentes son compatibles entre sí antes de comprarlos
              y evita errores costosos.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold mb-2">Optimización de PC</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Analiza tu PC actual y descubre cómo sacarle el máximo provecho
              con recomendaciones personalizadas.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-6 text-center text-gray-600 text-sm">
        PC SmartBuilder — Hecho con ❤️ para ayudarte a armar tu PC ideal
      </footer>

    </div>
  );
};

export default Home;