import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { getStudents } from '../../actions/studentActions';
import { generateReport } from '../../actions/reportActions';

export default function GenerateReport() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [testFiles, setTestFiles] = useState([
    { id: 1, title: '', file: null }
  ]);
  const [testProtocols] = useState([
    'BASC-3',
    'WISC-V',
    'KTEA-3',
    'WIAT-4',
    'WJ-IV',
    'BRIEF-2',
    'ADOS-2',
    'GARS-3',
    'CARS-2',
    'SRS-2',
    'ABAS-3',
    'CBCL',
    'Conners-3',
    'NEPSY-II',
    'OWLS-II'
  ]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data.students);
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  }

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
		
    // Find and set selected student details
    const student = students.find(s => s._id === studentId);
    setSelectedStudent(student || null);
  };

  const handleAdditionalFiles = (e) => {
    setAdditionalFiles([...additionalFiles, ...e.target.files]);
  };

  const handleAddField = () => {
    setTestFiles([
      ...testFiles,
      { id: Date.now(), title: '', file: null }
    ]);
  };

  const handleTitleChange = (id, value) => {
    setTestFiles(testFiles.map(field => 
      field.id === id ? { ...field, title: value } : field
    ));
  };

  const handleFileChange = (id, file) => {
    setTestFiles(testFiles.map(field => 
      field.id === id ? { ...field, file } : field
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('studentId', selectedStudent._id);

      // Append test files with their titles
      testFiles.forEach((field, index) => {
        if (field.file) {
          formDataToSend.append(`files`, field.file);
          formDataToSend.append(`titles`, field.title);
        }
      });

      const result = await generateReport(selectedStudent._id, formDataToSend);
      window.open(`http://localhost:5000/reports/${result.fileName}`, '_blank');
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/reports')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold">Generate New Report</h1>
        </div>

        {/* Report Generation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Student
            </label>
            <select
              value={selectedStudent?._id}
              onChange={handleStudentChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {`${student.firstName} ${student.lastName} - ${student.school}`}
                </option>
              ))}
            </select>
          </div>

          {/* Student Details Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Student Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.middleName ? selectedStudent.middleName : ''} ${selectedStudent.lastName}` : '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedStudent ? moment(selectedStudent.dateOfBirth).format('MM/DD/YYYY') : '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Age</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedStudent ? calculateAge(selectedStudent.dateOfBirth) : '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedStudent ? selectedStudent.gender ? 'Male' : 'Female' : '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">School</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedStudent ? selectedStudent.school : '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Grade</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedStudent ? selectedStudent.grade : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Test Files Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Test Files</h2>
              <button
                type="button"
                onClick={handleAddField}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
              >
                + Add New Test
              </button>
            </div>
            
            {/* Changed to grid layout with 5 columns */}
            <div className="grid grid-cols-4 gap-4">
              {testFiles.map((field) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3 bg-white">
                  <div className="flex">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Protocol
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        list="test-protocols"
                        value={field.title}
                        onChange={(e) => handleTitleChange(field.id, e.target.value)}
                        placeholder="Search test protocol"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="off"
                      />
                      <datalist id="test-protocols">
                        {testProtocols.map((protocol, index) => (
                          <option key={index} value={protocol} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload File
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(field.id, e.target.files[0])}
                      accept=".pdf,.doc,.docx"
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {field.file && (
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        Selected: {field.file.name} ({(field.file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper function to calculate age
const calculateAge = (birthDate) => {
  if (!birthDate) return '-';
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  
  // Adjust for when today's date is less than birth date
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
      years--;
    }
  }
  
  return `${years} years ${months} months`;
};