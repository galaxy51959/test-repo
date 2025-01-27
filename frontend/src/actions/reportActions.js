const SERVER_URL = `http://localhost:5000/api/reports`;

export const generateReport = async (studentId, formData) => {
  try {
    if (formData.length) {
      const getResult = await fetch(`${SERVER_URL}/generate/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await getResult.json();
      console.log("Generate Result: ", data);
      return data;
    } else {
      const getResult = await fetch(`${SERVER_URL}/generate/${studentId}`, {
        method: "POST",
        body: formData,
      });
      const data = await getResult.json();
      console.log("Generate Result: ", data);
      return data;
    }
  } catch (error) {
    console.error("Generate Report Error: ", error);
    throw error;
  }
};

export const getReports = async () => {
  try {
    const getResults = await fetch(`${SERVER_URL}`);
    const data = await getResults.json();
    console.log("Fetching Reports: ", data);
    return data;
  } catch (error) {
    console.error("Fetching Reports Error: ", error);
  }
};
