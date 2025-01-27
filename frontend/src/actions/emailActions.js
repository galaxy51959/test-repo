const SERVER_URL = "http://localhost:5000/api/emails";

export const sendEmails = async (studentId, emailData) => {
  try {
    const response = await fetch(`/${studentId}/send-emails`, {
      method: "POST",
      body: JSON.stringify(emailData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};
