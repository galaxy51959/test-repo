export const getStorage = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/storage`);
    if (!response.ok) {
      throw new Error('Failed to fetch storage files');
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch storage: " + error.message);
  }
};

export const uploadFiles = async (formData) => {
  try { 
    await fetch(`${import.meta.env.VITE_APP_API_URL}/storage/upload`, {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    console.log(error);
    // throw new Error("Failed to upload files: " + error.message);
  }
};