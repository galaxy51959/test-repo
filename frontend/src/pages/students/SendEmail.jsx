import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getStudentById } from "../../actions/studentActions";
import { sendEmails } from "../../actions/emailActions";

const n8nlink =
  "https://aec.app.n8n.cloud/webhook-test/2f137679-6041-4c14-ba16-305ff69e0fba";

const generateParentEmail = (ParentName, StudentName, Time, links) => {
  return `Dear ${ParentName}, \n  
    I hope this message finds you well. I am reaching out regarding ${StudentName})
    current special education evaluation. Your input is essential to your ${StudentName}’s overall
    evaluation, as the information you provide will play a critical role in determining appropriate
    next steps to support her educational needs. \n \r
    To complete this process, I kindly ask that you fill out the rating scales linked below. Please
    ensure that all scales are completed and returned to me no later than ${Time}. A decision
    regarding ${StudentName}’s evaluation cannot be made without this crucial information. \n \r
    BASC-3 Rating Scales: \n
    ${links["BASC-3-parent"]} \n \r
    Autism ASRS Rating Scale: \n
    ${links["ASR"]} \n \r
    Vineland Adaptive Behavior Rating Scale: \n
    ${links["Vineland-parent"]} \n \r
    Parent Interview Form which is located in a Fillable PDF that is attached to the bottom of this
    email. Please complete the form below and email this form back to me
    Your thorough and timely response is greatly appreciated. If you have any questions or need
    assistance, please do not hesitate to contact me.
    Thank you for your time and collaboration in this important process. Please feel free to reach out
    to me via email or phone at (833)524-6697.
    Warm regards,
    Alexis E. Carter
    School Psychologist, MS, LEP, NCSP`;
};

const generateTeacherEmail = (TeacherName, StudentName, Time, links) => {
  return `Dear ${ParentName}, \n  
    I hope this message finds you well. I am reaching out regarding ${StudentName})
    current special education evaluation. Your input is essential to your ${StudentName}’s overall
    evaluation, as the information you provide will play a critical role in determining appropriate
    next steps to support her educational needs. \n \r
    To complete this process, I kindly ask that you fill out the rating scales linked below. Please
    ensure that all scales are completed and returned to me no later than ${Time}. A decision
    regarding ${StudentName}’s evaluation cannot be made without this crucial information. \n \r
    BASC-3 Rating Scales: \n
    ${links.Basc - 3 - parent} \n \r
    Autism ASRS Rating Scale: \n
    ${links.Asr} \n \r
    Vineland Adaptive Behavior Rating Scale: \n
    ${links.Vineland} \n \r
    Parent Interview Form which is located in a Fillable PDF that is attached to the bottom of this
    email. Please complete the form below and email this form back to me
    Your thorough and timely response is greatly appreciated. If you have any questions or need
    assistance, please do not hesitate to contact me.
    Thank you for your time and collaboration in this important process. Please feel free to reach out
    to me via email or phone at (833)524-6697.
    Warm regards,
    Alexis E. Carter
    School Psychologist, MS, LEP, NCSP`;
};

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

      const parentLinks = {};
      const teacherLinks = {};

      data.assessments.forEach((item) => {
        if (item.rater == "parent") parentLinks[item.protocol] = item.file;
        if (item.rater == "teacher") teacherLinks[item.protocol] = item.file;
      });
      const teacherName = data.teacher.firstName + data.teacher.lastName;
      const studentName = data.firstName + data.middleName + data.lastName;
      setEmailData({
        ...emailData,
        parentEmail: generateParentEmail(
          teacherName,
          studentName,
          "2025y 5m 1",
          parentLinks
        ),
      });
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
    console.log("okay");
    e.preventDefault();
    try {
      const mailData = new FormData();
      mailData.append("from", "alexis.carter@provider.presence.com");
      mailData.append("to", "blackcatkai7@gmail.com");
      mail_formFata.append(
        "subject",
        `Student Initials, School, Grade Completion of Rating Scales for (Student Initials)- \n
                            Evaluation`
      );
      mail_formFata.append("html", emailData.parentEmail);
      // mail_formFata.append("file", formData.file, formData.file.name);

      await sendEmails(n8nlink, mailData);
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
