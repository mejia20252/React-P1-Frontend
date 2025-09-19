import 'react-toastify/dist/ReactToastify.css'

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import Perfil from './pages/Perfil';
import { useAuth } from './contexts/AuthContext';
import AdministradorRoutes from './routes/AdministradorRoutes';

import Sidebar from './components/Layout/Sidebar';
import Welcome from './pages/welcom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import UnauthorizedAccess from './pages/UnauthorizedAccess';

// Layout protegido con Sidebar único
const LayoutWithSidebar = () => {
  const { user } = useAuth();
  if (!user) return null; // o un spinner
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
          <Route
            path="/administrador/*"
            element={
              <ProtectedRoute requiredRoles={['Administrador']}>
                <AdministradorRoutes />
              </ProtectedRoute>
            }
          />
        
        </Route>

        {/* errores */}
        
        <Route path="/forbidden" element={<Forbidden />} />
        <Route
          path='/perfil' element={<Perfil />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
