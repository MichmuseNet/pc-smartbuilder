import { Navigate } from 'react-router-dom'
//Redirige de / a /home
function App() {
  return <Navigate to="/home" replace />
}

export default App