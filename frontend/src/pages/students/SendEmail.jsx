import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getStudentById } from "../../actions/studentActions";
import { sendEmails } from "../../actions/emailActions";

export default function SendEmail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [emailData, setEmailData] = useState({
    parentEmail: "",
    teacherEmail: "",
  });

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const data = await getStudentById(id);
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e, recipient) => {
    setEmailData((prev) => ({
      ...prev,
      [recipient]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendEmails(id, emailData);
      navigate("/students");
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/students")}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold">Send Assessment Emails</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Parent Email Group */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Parent Email
              </h2>

              {/* Parent Info */}
              <div className="mb-4 p-3 bg-white rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Name: {student.parent?.firstName} {student.parent?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {student.parent?.email}
                </p>
              </div>

              {/* Email Text Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Content
                </label>
                <textarea
                  rows="10"
                  value={emailData.parentEmail}
                  onChange={(e) => handleEmailChange(e, "parentEmail")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email content for parent..."
                />
              </div>
            </div>

            {/* Teacher Email Group */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Teacher Email
              </h2>

              {/* Teacher Info */}
              <div className="mb-4 p-3 bg-white rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Name: {student.teacher?.firstName} {student.teacher?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {student.teacher?.email}
                </p>
              </div>

              {/* Email Text Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Content
                </label>
                <textarea
                  rows="10"
                  value={emailData.teacherEmail}
                  onChange={(e) => handleEmailChange(e, "teacherEmail")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email content for teacher..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              Send Emails
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
