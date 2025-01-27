const SERVER_URL = `http://localhost:5000/api/reports`;

export const createScore = async (formData) => {
  try {
    const response = await fetch(`${SERVER_URL}/access-outside`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log("Create Score Result: ", data);
    return data;
  } catch (error) {
    console.error("Create Score Error: ", error);
    throw error;
  }
};

// export const getScores = async () => {
//     const response = await fetch(`${SERVER_URL}`);
//     const data = await response.json();
//     return data;
// }
