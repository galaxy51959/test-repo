import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import {
  generateReport,
  uploadFile,
} from "../../actions/reportActions";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getTemplate, getStudentById } from "../../actions/studentActions";

export default function GenerateReport() {
  const { user } = useAuth();
  const {id} = useParams();
  console.log(id);
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
      console.log(result_Std);
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
    console.log(tempFileObj);
    setFileObj(tempFileObj);

    await uploadFile(newFormData);
  };

  const handleGenerate = async () => {
    setLoading(true);
    console.log(id);
    const result = await generateReport({ type: "Initial" }, id);

    window.open(
      `http://localhost:5000/reports/${result.file}`,
      "_blank"
    );
    setFileObj({});
    setLoading(false);
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
            <li>Name: {studentInfo.firstName + studentInfo.lastName}</li>
          </ul>

          <ul className="flex gap-4 p-4">
            <li>School: {studentInfo.school}</li>
          </ul>
          <ul className="flex gap-4 p-4">
            <li>Grade: {studentInfo.grade}</li>
          </ul>
          <ul className="flex gap-4 p-4">
            <li>Birthday: {moment(studentInfo.dateOfBirth).format("MM/DD/YYYY")}</li>
          </ul>
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
                     <div
                     key={section.title}
                     className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border"
                   >
                     <span className="font-medium text-gray-700">{attachment}:</span>
                     {studentInfo.uploads && Object.keys(studentInfo.uploads).map((key)=>{
                      // console.log(key);
                      if(key == attachment)
                        return <span className="text-sm text-gray-600">{studentInfo.uploads[key].name.substring(studentInfo.uploads[key].name.indexOf("---")+3)}</span>
                     })}
                     {/* <span className="text-sm text-gray-600">"parent.docx"</span> */}
                   </div>
                    // <div key={attachmentIdx} className="relative group">
                    //   <label className="flex flex-col items-center justify-center relative h-40 w-40 border-2 border-dashed border-gray-300 rounded-xl p-2 cursor-pointer group-hover:border-blue-500 transition-colors bg-gray-50 group-hover:bg-blue-50">
                    //     {/* <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" /> */}
                    //     <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    //       {attachment}
                    //     </span>
                    //     <div
                    //     key={report.type}
                    //      className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border"
                    //      >
                    //    <span className="font-medium text-gray-700">{report.type}</span>
                    //    <span className="text-sm text-gray-600">{report.filename}</span>
                    //   </div>
                    //     {/* <input
                    //       type="file"
                    //       className="hidden"
                    //       accept=".pdf,.doc,.docx"
                    //       onChange={(e) =>
                    //         handleFileUpload(attachment, e.target.files[0])
                    //       }
                    //     /> */}
                    //     {/* {fileObj[attachment] && (
                    //       <span className="absolute bottom-2 left-3 text-sm font-medium line-clamp-1 text-gray-700 group-hover:text-blue-600">
                    //         {fileObj[attachment].name}
                    //       </span>
                    //     )} */}
                    //   </label>
                    // </div>
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
