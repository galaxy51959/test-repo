const SERVER_URL = "http://localhost:5000/api/emails";

export const sendEmails = async (n8nlink, mailData) => {
  try {
    const result = await fetch(n8nlink, {
      method: "POST",
      body: mailData,
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};
export const receiveEmails = async (data) => {
  try {
    const result = await fetch(`${SERVER_URL}/receiveEmail`, {
      method: "POST",
      body: data,
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};
