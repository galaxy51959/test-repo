import React, { useState } from 'react';
import { createScore } from '../actions/scoreActions';

const n8nlink = "https://aec.app.n8n.cloud/webhook/ac3019c4-ac6d-4a34-b2b2-8229de3f29fd/mail";

const Teachers = () => {
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentMiddleName: '',
    studentLastName: '',
    gender: '',
    dateOfBirth: '',
    sendTo: '',
    firstName: '',
    lastName: '',
    email: '',
    file: null
  });

  const [isAccessing , setIsAccessing] = useState(false);
  const [issendEmail, setIsSendingEmail] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAccessing(true);

    const studentInfo = {
      firstName: formData.studentFirstName,
      middleName: formData.studentMiddleName,
      lastName: formData.studentLastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,  
    }

    const targetInfo = {
      sendTo: formData.sendTo,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    }

     const result = await createScore({ studentInfo, targetInfo });
     console.log("Result: ", result);
    if(result[0] == undefined || result[1] == undefined) {
      alert("There is something error");
    }
    else{
       const links = {"Basc" : result[0].link.link_basc, "Asr": result[1].link, "Vineland" : result[0].link.link_vneland};
      sendMail(links);
      setIsAccessing(false);
      setIsSendingEmail(true);
    }
     

  };

    const generateParentEmail = (ParentName, StudentName, Time, links) =>{
      return `Dear ${ParentName}, \n  
      I hope this message finds you well. I am reaching out regarding ${StudentName})
      current special education evaluation. Your input is essential to your ${StudentName}’s overall
      evaluation, as the information you provide will play a critical role in determining appropriate
      next steps to support her educational needs. \n \r
      To complete this process, I kindly ask that you fill out the rating scales linked below. Please
      ensure that all scales are completed and returned to me no later than ${Time}. A decision
      regarding ${StudentName}’s evaluation cannot be made without this crucial information. \n \r
      BASC-3 Rating Scales: \n
      ${links.Basc} \n \r
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
    }
    const sendMail = async(links) =>{
    const parentName = formData.firstName + formData.lastName;
    const studentName = formData.firstName + formData.middleName + formData.lastName;

    const mail_Content = generateParentEmail(parentName, studentName, "2025y 1m 25", links);
   
    const mail_formFata = new FormData();
    
    mail_formFata.append('from', 'Alexis.carter@ssg-community.com'); 
    mail_formFata.append('to', formData.email); 
    mail_formFata.append('subject', `Student Initials, School, Grade Completion of Rating Scales for (Student Initials)- \n
                          Evaluation`); 
    mail_formFata.append('html',  mail_Content);
    mail_formFata.append('file', formData.file, formData.file.name); 
   
    try {
      const result = await fetch(n8nlink, {
          method: "POST",
          body: mail_formFata
      })

      const msgSending = await result.json();
      if(msgSending.message == "Success") {
        alert("Sent Email successfully");
        setIsSendingEmail(false);
      }
      else{
        alert("Sending Email is failed");
        setIsSendingEmail(false);
      }

      } catch (error) {
          alert(" You can't access n8n ");
      }
  }  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Teachers Portal</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Student Info Section */}
          <div className="mb-6">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Student Info</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student First Name
                </label>
                <input
                  type="text"
                  name="studentFirstName"
                  value={formData.studentFirstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Middle Name
                </label>
                <input
                  type="text"
                  name="studentMiddleName"
                  value={formData.studentMiddleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Last Name
                </label>
                <input
                  type="text"
                  name="studentLastName"
                  value={formData.studentLastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send To
                </label>
                <select
                  name="sendTo"
                  value={formData.sendTo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select recipient type</option>
                  <option value="parent">Parent</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent/Teacher Info Section */}
          <div className="mb-6">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Parent/Teacher Info</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Add File Upload Field */}
          <div className="mb-6">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">File Upload</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {formData.file && (
                  <p className="mt-1 text-sm text-gray-500">
                    Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
          {isAccessing ? '      Accessing...    ' : issendEmail ? 'Complete Accessing -> Sending Email ...' : isAccessing && issendEmail ? "Sent Email successfully" : "Please Start"}
        </form>
      </div>
    </div>
  );
};

export default Teachers; 