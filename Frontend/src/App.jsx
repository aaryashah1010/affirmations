import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './shared/hooks/useAuth.js';
import AppRoutes from './routes/AppRoutes.jsx';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
