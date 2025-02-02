const SERVER_URL = "http://172.86.110.178:5000/api/emails";

export const sendEmails = async (n8nlink, mailData) => {
  try {
    const response = await fetch(n8nlink, {
      method: "POST",
      body: mailData,
    });
    console.log(response);
    if (response.ok) {
      console.log(mailData);
      const response = await fetch(`${SERVER_URL}/sendEmail`, {
        method: "POST",
        body: mailData,
      });
      const result = await response.json();
      console.log(result);
      return result;
    }
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};

export const receiveEmails = async (data) => {
  try {
    console.log(data);
    const result = await fetch(`${SERVER_URL}/receiveEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};

export const getEmailsByAccount = async (account, folder) => {
  try {
    const response = await fetch(`${SERVER_URL}/${account}/${folder}`);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};

export const getEmails = async (searchTerm) => {
  try {
    console.log(searchTerm);
    const response = await fetch(`${SERVER_URL}/?search=${searchTerm}`);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};
