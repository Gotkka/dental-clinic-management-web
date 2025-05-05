import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserRoutes from './routes/userRoutes';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
