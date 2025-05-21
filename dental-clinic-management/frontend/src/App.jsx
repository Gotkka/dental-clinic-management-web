import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import UserRoutes from './routes/userRoutes';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoutes from './routes/adminRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


export default App;
