export const getPrompts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/prompts`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log("Error fetching prompts: ", error);
  }
};

export const getPromptsBySection = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/prompts/section`
    );
    const result = await response.json();

    return result;
  } catch (error) {
    console.log("Error fetching prompts: ", error);
  }
};

export const createPrompt = async (promptData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/prompts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promptData),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error Creating Prompts: ", error);
  }
};

export const updatePrompt = async (promptId, promptData) => {
  try {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/prompts/${promptId}`, {
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
