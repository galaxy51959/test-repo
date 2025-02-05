import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import {
  Students,
  AddStudent,
  StudentAssessment,
  SendEmail,
} from "./pages/students";
import { Reports, GenerateReport, Prompt } from "./pages/reports";
import Schedule from "./pages/Schedule";
import Mails from "./pages/Mails";
import SignIn from "./pages/SignIn";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";

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
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/signin" element={<SignIn />} />

            {/* Protected routes with Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />

              {/* Students */}
              <Route path="/students" element={<Students />} />
              <Route path="/students/new" element={<AddStudent />} />
              <Route
                path="/students/:id/assess"
                element={<StudentAssessment />}
              />
              <Route path="/students/:id/email" element={<SendEmail />} />

              {/* Mails */}
              <Route path="/mails" element={<Mails />} />

              {/* Reports */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:id" element={<GenerateReport />} />
              <Route path="/reports/prompts" element={<Prompt />} />

              {/* Schedule */}
              <Route path="/schedule" element={<Schedule />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
