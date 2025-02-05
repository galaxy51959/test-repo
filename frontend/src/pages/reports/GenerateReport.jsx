import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import {
  extractStudentInfo,
  generateReport,
  getTemplate,
  uploadFile,
} from "../../actions/reportActions";
import { getPromptsBySection } from "../../actions/promptActions";
import { calculateAge } from "../../utils";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function GenerateReport() {
  const { user } = useAuth();
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
    assessment: "Initial",
  });
  const [formData, setFormData] = useState([]);
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

  // const [formData, setFormData] = useState({
  //   // File Uploads
  //   customAssessFile: null,

  //   // Interview Scripts
  //   interviewFiles: [],

  //   // Assessment Results
  //   assessmentFiles: [],
  // });

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const template = await getTemplate();
      const result = template.sections.map((section) => {
        const needs = [];
        section.prompts.forEach((prompt) => {
          needs.push(...prompt.need);
        });
        const uniqueNeeds = [...new Set(needs)];
        return {
          ...section,
          needs: uniqueNeeds,
        };
      });
      setFormData(
        result.filter(
          (item) => item.needs.length > 0 && !item.needs.includes("SEIS")
        )
      );
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
      formData.append("type", "SEIS");
      formData.append("file", file);
      const data = await extractStudentInfo(formData);

      // For now, we'll simulate some data
      setStudent({
        name: data?.name || "",
        school: data?.school || "",
        dateOfBirth: data?.birthdate || "",
        parent_guardians: data?.parent_guardians || "Mr and Mrs Joshua",
        age: calculateAge(data?.birthdate || ""),
        team: "RSP Teacher, School Psychologist",
        language: data?.reporting_language || "",
        evaluation_date: new Date(),
        grade: data?.grade || "",
        psychologist: user.name,
        report_date: new Date(),
        assessment: "Initial",
      });
    }
  };

  const handleFileUpload = async (sectionIdx, needIdx, type, file) => {
    const data = [...formData];
    data[sectionIdx].needs.splice(needIdx, 1, { type: type, file: file });
    setFormData(data);

    const newFormData = new FormData();
    newFormData.append("type", type);
    newFormData.append("file", file);

    console.log(newFormData);

    await uploadFile(newFormData);
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

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateReport({
      student: {
        name: student.name,
        school: student.school,
        dateOfBirth: student.dateOfBirth,
        parent_guardians: student.parent_guardians,
        ageY: student.age.years,
        ageM: student.age.months,
        team: student.team,
        language: student.language,
        address: student?.address || "3513 Solar Way, Scaramento, CA 95827",
        grade: student.grade,
        dateOfReport: "TBD",
        assessment: "Initial",
      },
    });

    const handle = window.open(`http://172.86.110.178:6000/reports/${result.file}`, "_blank");
    console.log(handle);
    setLoading(false);
  };

  console.log(formData);

  return (
    <div className="rounded-lg">
      <div className="py-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <h1 className="px-4 text-xl font-semibold">Generate Report</h1>
        </div>

        {/* Section 1: SEIS File Upload and Student Info */}
        <div className="flex gap-6 mb-4">
          <div className="flex-1 bg-white shadow-md">
            <h2 className="px-6 pt-3 pb-2 text-lg font-medium border-b-4 border-gray-500">
              SEIS Information
            </h2>

            <div className="flex px-2">
              <div className="flex px-3 items-center">
                <label className="flex flex-col items-center justify-center relative h-40 w-40 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer group-hover:border-blue-500 transition-colors bg-gray-50 group-hover:bg-blue-50">
                  <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                  <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    SEIS FILE
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleSeisFileUpload}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2">
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
          </div>
          <div className="w-64 bg-white shadow-md">
            <h2 className="px-6 pt-3 pb-2 text-lg font-medium border-b-4 border-gray-500">
              Report Template
            </h2>
            <ul className="flex flex-col p-4">
              {["Initial", "Re-Evaluation", "Record Review", "FBA"].map(
                (option) => (
                  <li key={option} className="flex items-center py-2">
                    <span className="mr-auto">{option}</span>
                    <input
                      type="radio"
                      name="radio-group"
                      value={option}
                      checked={student.assessment === option}
                      onChange={(e) =>
                        setStudent({ ...student, assessment: e.target.value })
                      }
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Section 2: Assessment Protocol Uploads */}
        <div className="grid grid-cols-2 gap-6">
          {formData &&
            formData.map((section, sectionIdx) => (
              <div className="bg-white shadow-md" key={section._id}>
                <h2 className="px-6 pb-2 pt-3 text-lg font-medium">
                  {section.title}
                </h2>
                <div className="flex flex-wrap gap-3 p-3">
                  {section.needs.map((need, needIdx) => (
                    <div key={needIdx} className="relative group">
                      <label className="flex flex-col items-center justify-center relative h-40 w-40 border-2 border-dashed border-gray-300 rounded-xl p-2 cursor-pointer group-hover:border-blue-500 transition-colors bg-gray-50 group-hover:bg-blue-50">
                        <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                        <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                          {need.type || need}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            handleFileUpload(
                              sectionIdx,
                              needIdx,
                              need.type || need,
                              e.target.files[0]
                            )
                          }
                        />
                        {need.type && (
                          <span className="absolute bottom-2 left-3 text-sm font-medium line-clamp-1 text-gray-700 group-hover:text-blue-600">
                            {need.file.name}
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Section 3: Generate Button */}
        <div className="flex justify-center py-8">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <button
              onClick={handleGenerate}
              className="w-48 h-48 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl font-bold mb-2">GENERATE</span>
                <span className="text-xl opacity-75">REPORT</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
