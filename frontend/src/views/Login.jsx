import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
// Formulario de inicio de sesión
const Login = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Credenciales incorrectas');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setStatus('success');
      navigate('/dashboard');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 border border-gray-800">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">PC SmartBuilder</h1>
          <p className="text-gray-400 mt-2">Inicia sesión</p>
        </div>

        {status && status !== 'success' && status !== 'loading' && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            required
            onChange={handleChange}
            className="bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            onChange={handleChange}
            className="bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-2"
          >
            {status === 'loading' ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;