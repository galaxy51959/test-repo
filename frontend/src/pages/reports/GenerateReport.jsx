import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { generateReport } from "../../actions/reportActions";
import MultiSelect from "../../components/ui/MultiSelect";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getTemplate, getStudentById } from "../../actions/studentActions";

export default function GenerateReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState({
    "Academic Support Recommendations": {
      "Small Group or 1:1 Instruction": false,
      "Extended Time on Assignments & Assessments": false,
      "Chunking Assignments": false,
      "Check-ins for Understanding": false,
      "Visual Supports": false,
      "Preferential Seating": false,
      "Consistent Routines": false,
      "Use of Assistive Technology": false,
      "Alternative Assignment Formats": false,
      "Frequent Movement Breaks": false,
    },
    "Behavioral and Social-Emotional Support Recommendations": {
      "Social Skills Training": false,
      "Behavior Intervention Plan(BIP)": false,
      "Check-In/Check-Out System": false,
      "Counseling Services": false,
      "Self-Regulation Strategies": false,
      "Positive Reinforcement": false,
      "Safe Space in the Classroom": false,
      "Peer Buddies or Mentoring Program": false,
      "Clear and Consistent Expectations": false,
      "Emotional Check-Ins": false,
    },
    "Executive Functioning and Organizational Skills Recommendations": {
      "Daily Planner or Agenda": false,
      "Task Initiation Support": false,
      "Structured Transitions": false,
      "Frequent Redirection and Prompts": false,
      "Goal-Setting Strategies": false,
    },
    "Environmental Modifications": {
      "Reduced Distractions in the Classroom": false,
      "Flexible Seating Options": false,
      "Sensory Tools": false,
      "Quiet Work Space Access": false,
      "Visual Cues and Checklists": false,
    },
  });

  const [student, setStudent] = useState({
    assessment: "Initial",
  });
  const [eligibility, setEligibility] = useState(
    "Autism Spectrum Disorder(ASD)"
  );
  const [formData, setFormData] = useState([]);
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
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecommendations = (key, selectedRecommendations) => {
    console.log(selectedRecommendations);
    const temp = recommendations[key];
    Object.entries(temp).forEach(([key, value]) => {
      temp[key] = Object.values(selectedRecommendations).includes(key)
        ? true
        : false;
    });
    setRecommendations({ ...recommendations, [key]: temp });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateReport(
      { type: "Initial", eligibility, recommendations },
      id
    );

    window.open(
      `${import.meta.env.VITE_PUBLIC_URL}/reports/${result.file}`,
      "_blank"
    );
    setLoading(false);
    // navigate('/upload');
  };

  console.log(recommendations);

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
            <li>
              Birthday: {moment(studentInfo.dateOfBirth).format("MM/DD/YYYY")}
            </li>
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
        <div className="flex flex-col gap-6 divide-y-2">
          {formData &&
            formData.slice(0, formData.length - 3).map((section) => (
              <div className="flex" key={section._id}>
                <h2 className="px-6 pt-6 text-md font-medium flex items-center justify-center w-96">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3 p-3 flex-3">
                  {section.attachments.map(
                    (attachment, attachmentIdx) =>
                      studentInfo.uploads &&
                      Object.keys(studentInfo.uploads)
                        .filter((key) => key === attachment)
                        .map((key) => (
                          <div
                            key={section.title + attachmentIdx}
                            className="flex justify-between items-center p-4 rounded-lg"
                          >
                            <span className="font-medium text-gray-700 pr-2">
                              {attachment}:
                            </span>
                            <span className="text-sm text-gray-600" key={key}>
                              {studentInfo.uploads[key].name.substring(
                                studentInfo.uploads[key].name.indexOf("---") + 3
                              )}
                            </span>
                          </div>
                        ))
                  )}
                </div>
              </div>
            ))}
          <div className="flex pt-6" key="Summary and Diagnostic Impression">
            <h2 className="px-6 text-md font-medium flex items-center justify-center w-96">
              Eligibility Category
            </h2>
            <select
              className="w-1/2 p-2 border rounded-lg focus:outline-none bg-inherit"
              name="eligibility"
              id="eligibility"
              onChange={(e) => setEligibility(e.target.value)}
            >
              <option value="Autism Spectrum Disorder(ASD)">
                Autism Spectrum Disorder(ASD)
              </option>
              <option value="Specific Learning Disability(SLD)">
                Specific Learning Disability(SLD)
              </option>
              <option value="Other Health Impairment(OHI)">
                Other Health Impairment(OHI)
              </option>
              <option value="Emotional Disturbance(ED)">
                Emotional Disturbance(ED)
              </option>
              <option value="Intellectual Disability(ID)">
                Intellectual Disability(ID)
              </option>
              <option value="Deafness">Deafness</option>
              <option value="Hearing Impairment">Hearing Impairment</option>
              <option value="Visual Impairment(VI), Including Blindness">
                Visual Impairment(VI), Including Blindness
              </option>
              <option value="Orthopedic Impairment(OI)">
                Orthopedic Impairment(OI)
              </option>
              <option value="Traumatic Brain Injury(TBI)">
                Traumatic Brain Injury(TBI)
              </option>
              <option value="Deaf-Blindness">Deaf-Blindness</option>
              <option value="Multiple Disabilities">
                Multiple Disabilities
              </option>
              <option value="Speech or Language Impairment(SLI)">
                Speech or Language Impairment(SLI)
              </option>
            </select>
          </div>

          <div className="flex pt-6" key="Summary and Diagnostic Impression">
            <h2 className="px-6 text-md font-medium flex items-center justify-center w-96">
              Recommendations
            </h2>
            <div className="flex flex-col w-full">
              {Object.entries(recommendations).map(([key, value]) => (
                <div className="flex gap-3 p-3 flex-3">
                  <div className="text-md font-medium flex items-center justify-center w-96">
                    {key}
                  </div>
                  <MultiSelect
                    options={Object.keys(recommendations[key])}
                    selectedOptions={Object.keys(recommendations[key]).filter(
                      (subKey) => recommendations[key][subKey] === true
                    )}
                    setSelectedOptions={(options) =>
                      handleSelectRecommendations(key, options)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
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
