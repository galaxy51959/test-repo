export const sendEmails = async (n8nlink, mailData) => {
  try {
    const response = await fetch(n8nlink, {
      method: "POST",
      body: mailData,
    });
    if (response.ok) {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/emails/sendEmail`,
        {
          method: "POST",
          body: mailData,
        }
      );
      const result = await response.json();
      return result;
    }
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};

export const receiveEmails = async (data) => {
  try {
    const result = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/emails/receiveEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};

export const getEmailsByAccount = async (account, folder) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/emails/${account}/${folder}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};

export const getEmails = async (searchTerm) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/emails/?search=${searchTerm}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw error.response?.data?.message || "Error sending emails";
  }
};
