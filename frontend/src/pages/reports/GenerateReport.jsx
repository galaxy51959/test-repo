import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { getStudentById, getStudents } from '../../actions/studentActions';
import { generateReport } from '../../actions/reportActions';
import { getFullName } from '../../utils';

export default function GenerateReport() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState();
  const [loading, setLoading] = useState(false);
  const [assessmentProtocols] = useState([
    'BASC-3',
    'WISC-V',
		'TAPS-4',
		'TVPS-4',
    'Academic',
    'GARS-3',
    'ASRS',
		'CTONI-2',
		'DAY C-2',
		'WRAML-3',
		'BG-2'
  ]);

  const [formData, setFormData] = useState({
    // File Uploads
    seisFile: null,
    customAssessFile: null,
    
    // Interview Scripts
    interviewFiles: [],
    
    // Assessment Results
    assessmentFiles: []
  });

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const data = await getStudentById(id);
      setStudent(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		// await uploadFile();
    try {
      setLoading(true);
      const result = await generateReport(student._id, assessmentProtocols);
      window.open(`http://localhost:5000/reports/${result.fileName}`, '_blank');
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, fieldName) => {
    const { files } = e.target;
    if (fieldName === 'interviewFiles' || fieldName === 'assessmentFiles') {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...files]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: files[0]
      }));
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
          <h1 className="text-2xl font-semibold">Generate Report</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Student Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Student Information</h2>
                
                {/* Student Info Display */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Student Name</label>
                      <p className="mt-1 text-sm text-gray-900">{student ? getFullName(student) : '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Grade</label>
                      <p className="mt-1 text-sm text-gray-900">{student?.grade || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">School</label>
                      <p className="mt-1 text-sm text-gray-900">{student?.school || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Language</label>
                      <p className="mt-1 text-sm text-gray-900">{student?.language || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                      <p className="mt-1 text-sm text-gray-900">{student?.parent ? getFullName(student.parent) : '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                      <p className="mt-1 text-sm text-gray-900">{student?.parent?.email || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                      <p className="mt-1 text-sm text-gray-900">{student?.teacher ? getFullName(student.teacher) : '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teacher Email</label>
                      <p className="mt-1 text-sm text-gray-900">{student?.teacher?.email || '-'}</p>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEIS File</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'seisFile')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom Assessment File</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'customAssessFile')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Interview Scripts and Assessment Results */}
            <div className="space-y-6">
              {/* Interview Scripts */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Script</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Interview Files</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'interviewFiles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Display uploaded interview files */}
                  {formData.interviewFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                      <ul className="mt-1 text-sm text-gray-500">
                        {formData.interviewFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Assessment Results */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Assessment Results</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Assessment Files</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'assessmentFiles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Display uploaded assessment files */}
                  {formData.assessmentFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                      <ul className="mt-1 text-sm text-gray-500">
                        {formData.assessmentFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              Generate Report
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