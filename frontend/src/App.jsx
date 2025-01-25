import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { Students, AddStudent, StudentAssessment } from './pages/students';
import { Reports, GenerateReport } from './pages/reports';
import Teachers from './pages/Teachers';
import SignIn from './pages/SignIn';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log(isAuthenticated);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}


function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        {/* Public route */}
        <Route path="/signin" element={<SignIn />} />

        {/* Protected routes with Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />

          {/* Students */ }
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<AddStudent />} />
          <Route path="/students/:id/assess" element={<StudentAssessment />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/new" element={<GenerateReport />} />

          {/* Teachers */}
          <Route path="/teachers" element={<Teachers />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
