export const getNotionData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/calendar`
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const createNotionData = async (Data) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/calendar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      }
    );
    const result = await response.json();
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};

export const updateNotionData = async (Data) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/calendar/${Data.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      }
    );
    const result = await response.json();
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};

export const deleteNotionData = async (id) => {
  try {
    console.log(id);
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/calendar/${id}`
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};
