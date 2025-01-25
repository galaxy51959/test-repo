import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { Students, AddStudent, StudentAssessment } from './pages/students';
import { Reports, GenerateReport } from './pages/reports';
import Teachers from './pages/Teachers';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
