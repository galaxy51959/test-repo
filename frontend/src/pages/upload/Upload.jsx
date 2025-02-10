import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowUpTrayIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getStudents } from '../../actions/studentActions';
// Add this mock data after the imports and before the component
const MOCK_STUDENTS = [
  {
    _id: '1',
    name: 'John Smith',
    school: 'Lincoln High School',
    grade: '10th',
    birthday: '2008-05-15',
    reportStatus: 'generated'
  },
  {
    _id: '2',
    name: 'Emma Johnson',
    school: 'Washington Middle School',
    grade: '8th',
    birthday: '2010-03-22',
    reportStatus: 'pending'
  },
  {
    _id: '3',
    name: 'Michael Brown',
    school: 'Roosevelt Elementary',
    grade: '5th',
    birthday: '2013-11-08',
    reportStatus: 'generated'
  },
  {
    _id: '4',
    name: 'Sarah Davis',
    school: 'Jefferson High School',
    grade: '11th',
    birthday: '2007-09-30',
    reportStatus: 'pending'
  },
  {
    _id: '5',
    name: 'David Wilson',
    school: 'Lincoln High School',
    grade: '9th',
    birthday: '2009-07-14',
    reportStatus: 'generated'
  }
];

const Uploads = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    grade: '',
    birthday: '',
    reportStatus: 'pending' // 'pending' or 'generated'
  });

  // Fetch students data
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      const response = await getStudents();
      const transformedData = response.students.map((student)=>( {
        _id: student._id,
        name:  student.firstName + " " +  student.lastName,
        birthday: student.dateOfBirth,
        school: student.lastName,
        grade: student.grade,
      }      
      ));
      // Use mock data instead of API call
      setStudents(transformedData);

      
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success('Student added successfully');
        setShowAddModal(false);
        resetForm();
        fetchStudents();
      }
    } catch (error) {
      toast.error('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/students/${selectedStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success('Student updated successfully');
        setShowEditModal(false);
        resetForm();
        fetchStudents();
      }
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/students/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          toast.success('Student deleted successfully');
          fetchStudents();
        }
      } catch (error) {
        toast.error('Failed to delete student');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpload = (studentId) => {
    navigate(`/reports/${studentId}`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      school: '',
      grade: '',
      birthday: '',
      reportStatus: 'pending'
    });
    setSelectedStudent(null);
  };

  const StudentModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? 'Edit Student' : 'Add New Student'}
        </h2>
        <form onSubmit={isEdit ? handleEditStudent : handleAddStudent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                isEdit ? setShowEditModal(false) : setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {loading && <LoadingSpinner />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <DocumentPlusIcon className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.school}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(student.birthday).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUpload(student._id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.reportStatus === 'generated' ? (
                    <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                      Generated
                    </span>
                  ) : (
                    <button
                      onClick={() => handleUpload(student._id)}
                      className="px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200"
                    >
                      Generate
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setFormData(student);
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <StudentModal />}
      {showEditModal && <StudentModal isEdit />}
    </div>
  );
};

export default Uploads;