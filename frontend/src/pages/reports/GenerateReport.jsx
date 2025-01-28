import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ArrowLeftIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { extractStudentInfo } from "../../actions/reportActions";
import { getPromptsBySection } from "../../actions/promptActions";
import { calculateAge } from "../../utils";

export default function GenerateReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    school: "",
    dateOfBirth: "",
    parent_guardians: "",
    age: "",
    team: "RSP Teacher, School Psychologist",
    language: "",
    evaluation_date: new Date(),
    grade: "",
    psychologist: user.name,
    report_date: new Date(),
    assessment: "",
  });
  const [prompts, setPrompts] = useState([]);
  const [seisFile, setSeisFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assessmentProtocols] = useState([
    "BASC-3",
    "WISC-V",
    "TAPS-4",
    "TVPS-4",
    "Academic",
    "GARS-3",
    "ASRS",
    "CTONI-2",
    "DAY C-2",
    "WRAML-3",
    "BG-2",
  ]);

  const [formData, setFormData] = useState({
    // File Uploads
    customAssessFile: null,

    // Interview Scripts
    interviewFiles: [],

    // Assessment Results
    assessmentFiles: [],
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await getPromptsBySection();
      setPrompts(response);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeisFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSeisFile(file);

      // Here you would add logic to extract student info from SEIS file
      const formData = new FormData();
      formData.append("file", file);
      const data = await extractStudentInfo(formData);

      // For now, we'll simulate some data
      setStudent({
        name: data?.name || "",
        school: data?.school || "",
        dateOfBirth: data?.birthdate || "",
        parent_guardians: data?.parent_guardians || "",
        age: calculateAge(data?.birthdate || ""),
        team: "RSP Teacher, School Psychologist",
        language: data?.reporting_language || "",
        evaluation_date: new Date(),
        grade: data?.grade || "",
        psychologist: user.name,
        report_date: new Date(),
        assessment: "",
      });
    }
  };

  const getValue = (key, value) => {
    switch (key) {
      // case 'parent_guardians':
      // return value.map((parent) => parent.email).join(', ');
      case "dateOfBirth":
        return moment(value).format("MM/DD/YYYY");
      case "evaluation_date":
        return moment(value).format("MM/DD/YYYY");
      case "report_date":
        return moment(value).format("MM/DD/YYYY");
      case "age":
        return `${value.years} years ${value.months} months`;
      default:
        return value || "N/A";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate("/reports")}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold">Generate Report</h1>
      </div>

      {/* Section 1: SEIS File Upload and Student Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Student Information</h2>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <ArrowUpTrayIcon className="h-5 w-5" />
            Upload SEIS File
            <input
              type="file"
              onChange={handleSeisFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx"
            />
          </label>
        </div>

        <div className="px-6 grid grid-cols-2">
          {Object.entries(student).map(([key, value]) => (
            <div key={key} className="px-6 py-2 flex items-center">
              <label className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:&nbsp;
              </label>
              <div type="text" className="text-gray-900">
                {value ? getValue(key, value) : "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Assessment Protocol Uploads */}
      {prompts &&
        prompts.map((section) => (
          <div className="py-4" key={section._id}>
            <h2 className="p-2 text-lg font-semibold border-b-4 border-gray-300 mb-4">
              {section._id}
            </h2>
            <div className="flex flex-wrap gap-4">
              {section.protocols.map((protocol) => (
                <div key={protocol} className="relative group">
                  <label className="flex flex-col items-center justify-center relative h-40 w-40 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer group-hover:border-blue-500 transition-colors bg-gray-50 group-hover:bg-blue-50">
                    <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                    <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {protocol}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        console.log(`${protocol} file:`, e.target.files[0])
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Section 3: Generate Button */}
      <div className="flex justify-center py-8">
        <button
          onClick={() => console.log("Generating report...")}
          className="w-48 h-48 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-bold mb-2">GENERATE</span>
            <span className="text-xl opacity-75">REPORT</span>
          </div>
        </button>
      </div>
    </div>
  );
}
