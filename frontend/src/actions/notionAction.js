const SERVER_URL = "http://localhost:5000/api/calendar";

export const getNotionData = async () => {
  const response = await fetch(`${SERVER_URL}`);
  const data = await response.json();
  return data;
};

export const createNotionData = async (Data) => {
  try {
    const response = await fetch(`${SERVER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};
