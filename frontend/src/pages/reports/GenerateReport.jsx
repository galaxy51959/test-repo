import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { getStudents } from '../../actions/studentActions';
import { generateReport } from '../../actions/reportActions';
import { getFullName } from '../../utils';

export default function GenerateReport() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [testFiles, setTestFiles] = useState([
    { id: 1, protocol: '', file: null }
  ]);
  const [testProtocols] = useState([
    'BASC-3-Parent',
		'BASC-3-Teacher',
    'WISC-V',
		'TAPS-4',
		'TVPS-4',
    'Academic',
    'GARS-3-Parent',
    'GARS-3-Teacher',
    'ASRS',
		'CTONI-2',
		'DAY C-2',
		'WRAML-3',
		'BG-2'
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

	const uploadFile = async () => {
		const lastField = testFiles[testFiles.length - 1];
		
		if (!lastField.protocol || !lastField.file)
			return;

		const formData = new FormData();
		formData.append('protocol', lastField.protocol);
		formData.append('file', lastField.file);

		await generateReport(selectedStudent._id, formData);
	}

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
		
    // Find and set selected student details
    const student = students.find(s => s._id === studentId);
    setSelectedStudent(student || null);
  };

  const handleAddField = async () => {
		await uploadFile();
    setTestFiles([
      ...testFiles,
      { id: Date.now(), protocol: '', file: null }
    ]);
  };

  const handleTitleChange = (id, value) => {
    setTestFiles(testFiles.map(field => 
      field.id === id ? { ...field, protocol: value } : field
    ));
  };

  const handleFileChange = (id, file) => {
    setTestFiles(testFiles.map(field => 
      field.id === id ? { ...field, file } : field
    ));
  };

  const handleRemoveField = (id) => {
    setTestFiles(testFiles.filter(field => field.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		await uploadFile();
    try {
      setLoading(true);
      const result = await generateReport(selectedStudent._id, testFiles.map(field => field.protocol));
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
                <div key={field.id} className="border rounded-lg p-4 space-y-3 bg-white relative">
                  {/* Add remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
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