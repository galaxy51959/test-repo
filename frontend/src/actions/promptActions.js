const SERVER_URL = "http://172.86.110.178:5000/api/prompts";

export const getPrompts = async () => {
  try {
    const response = await fetch(`${SERVER_URL}`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log("Error fetching prompts: ", error);
  }
};

export const getPromptsBySection = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/section`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log("Error fetching prompts: ", error);
  }
};

export const createPrompt = async (promptData) => {
  try {
    const response = await fetch(`${SERVER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};

export const updatePrompt = async (promptId, promptData) => {
  try {
    await fetch(`${SERVER_URL}/${promptId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptData),
    });
  } catch (error) {
    console.error("Error updating Students:", error);
  }
};
