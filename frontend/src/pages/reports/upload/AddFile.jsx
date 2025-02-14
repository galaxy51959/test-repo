import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import {
  getTemplate,
  uploadFile,
  updateStudent,
  getStudentById
} from "../../../actions/studentActions";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

export default function GenerateReport() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [student, setStudent] = useState({
    assessment: "Initial",
  });
  const [formData, setFormData] = useState([]);
  const [fileObj, setFileObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState({});

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const template = await getTemplate();
      const result = template.sections.map((section) => {
        const attachments = [];
        section.prompts.forEach((prompt) => {
          attachments.push(...prompt.attachments);
        });
        const uniqueAttachments = [...new Set(attachments)];
        return {
          ...section,
          attachments: uniqueAttachments,
        };
      });

      setFormData(result.filter((item) => item.attachments.length > 0));

      const result_Std = await getStudentById(id);
      setStudentInfo(result_Std);
      setFileObj(result_Std.uploads);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (type, file) => {
    const newFormData = new FormData();
    newFormData.append("type", type);
    newFormData.append("file", file);
    const tempFileObj = { ...fileObj };
    tempFileObj[type] = file;
    setFileObj(tempFileObj);
    await uploadFile(newFormData, id);
  };

  const handleComplete = async () => {
    // setLoading(true);
    updateStudent(id, {report: ""});
    navigate('/upload');
    // setLoading(false);
  };

  console.log(fileObj);

  return (
    <div className="rounded-lg">
      <div className="py-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <h1 className="px-4 text-xl font-semibold">Generate Report</h1>
        </div>

        {/* Section 1: SEIS File Upload and Student Info */}
        <div className="flex justify-between border-b-4 border-gray-500 mb-4">
          <h2 className="px-6 pt-3 pb-2 text-lg font-medium">
            Basic Information
          </h2>
          <ul className="flex gap-4 p-4">
            {["Initial", "Re-Evaluation", "Record Review", "FBA"].map(
              (option) => (
                <li key={option} className="flex items-center px-2">
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
                  <span className="ml-2">{option}</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Section 2: Assessment Protocol Uploads */}
        <div className="grid grid-cols-2 gap-6">
          {formData &&
            formData.slice(0, formData.length-3).map((section, sectionIdx) => (
              <div className="bg-white shadow-md" key={section._id}>
                <h2 className="px-6 pb-2 pt-3 text-lg font-medium">
                  {section.title}
                </h2>
                <div className="flex flex-wrap gap-3 p-3">
                  {section.attachments.map((attachment, attachmentIdx) => (
                    <div key={attachmentIdx} className="relative group">
                      <label className="flex flex-col items-center justify-center relative h-40 w-40 border-2 border-dashed border-gray-300 rounded-xl p-2 cursor-pointer group-hover:border-blue-500 transition-colors bg-gray-50 group-hover:bg-blue-50">
                        <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                        <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                          {attachment}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            handleFileUpload(attachment, e.target.files[0])
                          }
                        />
                        {fileObj && fileObj[attachment] && (
                          <span className="absolute bottom-2 left-3 text-sm font-medium line-clamp-1 text-gray-700 group-hover:text-blue-600">
                            {fileObj[attachment].name}
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
              onClick={handleComplete}
              className="w-48 h-48 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl font-bold mb-2">UPLOAD</span>
                <span className="text-xl opacity-75">FILES</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
