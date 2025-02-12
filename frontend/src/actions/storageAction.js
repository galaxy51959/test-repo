export const getStorage = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/storage/files`);
    if (!response.ok) {
      throw new Error('Failed to fetch storage files');
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch storage: " + error.message);
  }
};

export const uploadFiles = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/storage/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to upload files: " + error.message);
  }
};