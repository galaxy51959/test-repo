const SERVER_URL = "http://localhost:5000/api/calendar";

export const getNotionData = async () => {
  try {
    const response = await fetch(`${SERVER_URL}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
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

export const updateNotionData = async (Data) => {
  try {
    const response = await fetch(`${SERVER_URL}/${Data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};

export const deleteNotionData = async (id) => {
  try {
    console.log(id);
    const response = await fetch(`${SERVER_URL}/${id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};
