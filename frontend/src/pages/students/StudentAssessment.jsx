import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getStudentById } from "../../actions/studentActions";
import { createScore } from "../../actions/scoreActions";
import { assignLink } from "../../actions/studentActions";
export default function StudentAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null); //student info
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const data = await getStudentById(id);
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientsChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedRecipients(value);
  };

  const handleAssessment = async () => {
    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient");
      return;
    }
    const studentInfo = {
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
    };
    const targetInfo = [];
    selectedRecipients.map((item) => {
      const recipientInfo = {
        sendTo: item,
        firstName: student[item].firstName,
        lastName: student[item].lastName,
        email: student[item].email,
      };
      targetInfo.push(recipientInfo);
    });

    //const result = await createScore({ studentInfo, targetInfo });
    const result = [
      {
        link: {
          parent: ["http:/1", "http:/2"],
          // teacher:["http:/3", "http:/4"]
        },
        protocol: "Qglobal",
      },
      {
        link: [
          {
            parent: "http:/5",
          },
        ],
        protocol: "MHS",
      },
    ];
    console.log("Result: ", result);

    const res = { teacher: [], parent: [] };
    if (result[0].link.teacher && !result[0].link.teacher.includes(null)) {
      res.teacher = res.teacher.concat(result[0].link.teacher);
    }
    if (result[0].link.parent && !result[0].link.parent.includes(null)) {
      res.parent = res.parent.concat(result[0].link.parent);
    }
    if (
      result[1].link[0].teacher &&
      !result[1].link[0].teacher.includes(null)
    ) {
      res.teacher.push(result[1].link[0].teacher);
    }
    if (result[1].link[0].parent && !result[1].link[0].parent.includes(null)) {
      res.parent.push(result[1].link[0].parent);
    }

    console.log(res);
    if (res.teacher.length == 3) {
      const mergeditem0 = { protocol: "BASC-3-teacher", link: res.teacher[0] };
      const mergeditem1 = {
        protocol: "Vineland-teacher",
        link: res.teacher[1],
      };
      const mergeditem2 = { protocol: "ASR", link: res.teacher[2] };
      res.teacher[0] = mergeditem0;
      res.teacher[1] = mergeditem1;
      res.teacher[2] = mergeditem2;
    }
    if (res.parent.length == 3) {
      const mergeditem0 = { protocol: "BASC-3-parent", link: res.parent[0] };
      const mergeditem1 = { protocol: "Vineland-parent", link: res.parent[1] };
      const mergeditem2 = { protocol: "ASR", link: res.parent[2] };
      res.parent[0] = mergeditem0;
      res.parent[1] = mergeditem1;
      res.parent[2] = mergeditem2;
    }
    Object.keys(res).map((key) => {
      if (res[key].length == 0) {
        delete res[key];
      }
    });
    console.log(res);
    assignLink(id, res);

    // if(result[0] == undefined || result[1] == undefined) {
    //   alert("There is something error");
    // }

    // Handle assessment logic here
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
          <h1 className="text-2xl font-semibold">Student Assessment</h1>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Student Info - Takes full height of first column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Student Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                  {student.firstName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                  {student.middleName || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                  {student.lastName}
                </div>
              </div>

              {/* Gender and Date of Birth in a row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {student.gender ? "Male" : "Female"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Grade and Language in a row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {student.grade}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {student.language}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                  {student.school}
                </div>
              </div>
            </div>
          </div>

          {/* Second column with Parent and Teacher Info stacked vertically */}
          <div className="space-y-6">
            {/* Parent Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Parent Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      {student.parent?.firstName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      {student.parent?.lastName}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {student.parent?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Teacher Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      {student.teacher?.firstName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      {student.teacher?.lastName}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {student.teacher?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Send To */}
            <div className="flex justify-end items-center space-x-4 pr-4">
              <label className="block text-sm font-medium text-gray-700 mr-2">
                Send To:
              </label>
              <select
                multiple
                value={selectedRecipients}
                onChange={handleRecipientsChange}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                size="2"
              >
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
              </select>
              <button
                onClick={handleAssessment}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
              >
                Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
